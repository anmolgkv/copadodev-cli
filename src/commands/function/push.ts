import * as os from 'os';
import chalk from 'chalk';
import { readdir } from 'fs/promises'
import { pathExists, readFile, readJson } from 'fs-extra';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { flags, SfdxCommand } from '@salesforce/command';
import { RestConnections } from '../../services/restConnection';

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('copadoDev', 'function');

export default class PushFunction extends SfdxCommand {
    public static description = messages.getMessage('push.description');
    public static examples = messages.getMessage('push.examples').split(os.EOL);

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: messages.getMessage('push.flags.name.description')
        })
    };


    public async run(): Promise<AnyJson> {
        let results = [];
        const name = this.flags.name as string;
        const records = name ? [await this.getLocalFunction(name)] : (await this.getAllFunction());

        this.ux.startSpinner(messages.getMessage('push.pushingFunction'));

        const chunkSize = 9;
        for (let i = 0; i < records.length; i += chunkSize) {
            const chunk = records.slice(i, i + chunkSize);
            const result = await RestConnections.upsert('copado__Function__c', chunk, 'copado__API_Name__c');
            results = results.concat(result);
            this.ux.setSpinnerStatus(`\nPushed ${i + chunkSize} of ${records.length} functions`)
        }

        this.ux.stopSpinner();
        this.ux.log(`${chalk.green.bold(records.length + messages.getMessage('push.success'))}`);

        return results;
    }


    private async getLocalFunction(name: string) {
        if (!await pathExists(`./copado-data/functions/${name}/parameter.json`)) {
            throw new Error(`Invalid function ${name}`);
        }

        return await this.asRecord(name);
    }


    private async getAllFunction() {
        return await Promise.all((await this.getFunctionNames('./copado-data/functions'))
                .map(async (name) => {
                    return await this.getLocalFunction(name);
                }));
    }


    private async getFunctionNames(source): Promise<string[]> {
        return (await readdir(source, { withFileTypes: true }))
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
    }


    private async asRecord(name: string) {
        const detail = await readJson(`./copado-data/functions/${name}/details.json`);
        const fileName = this.getFileName(detail.lang);
        const script = await readFile(`./copado-data/functions/${name}/${fileName}`, 'utf8');
        const parameters = await readFile(`./copado-data/functions/${name}/parameter.json`, 'utf8');

        return {
            Name: name,
            Id: detail.id,
            copado__API_Name__c: name,
            copado__Script__c: script,
            copado__Parameters__c: parameters,
            copado__ApexClass__c: detail.apexClass,
            copado__Callback_Type__c: detail.callbackType,
            copado__Description__c: detail.description,
            copado__FlowHandler__c: detail.flowHandler,
            copado__Worker_Size__c: detail.size,
            copado__Options__c: detail.options,
            copado__Timeout__c: detail.timeout,
            copado__Type__c: detail.type,
            copado__Version__c: detail.version,
            copado__Image_Name__c: detail.imageName
        }
    }


    private getFileName(lang: string) : string {
        if(lang === 'nodejs') {
            return 'script.js';
        } else if(lang === 'python') {
            return 'script.py';
        }

        return 'script.sh';
    }
}
