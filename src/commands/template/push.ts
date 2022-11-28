import * as os from 'os';
import chalk from 'chalk';
import { readdir } from 'fs/promises'
import { pathExists, readFile, readJson } from 'fs-extra';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { flags, SfdxCommand } from '@salesforce/command';
import { RestConnections } from '../../services/restConnection';

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('copadodev-cli', 'template');

export default class PushTemplate extends SfdxCommand {
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
        const records = name ? [await this.getLocalTemplate(name)] : (await this.getAllTemplates());

        this.ux.startSpinner(messages.getMessage('push.pushingTemplate'));

        const chunkSize = 9;
        for (let i = 0; i < records.length; i += chunkSize) {
            const chunk = records.slice(i, i + chunkSize);
            const result = await RestConnections.upsert('copado__JobTemplate__c', chunk, 'copado__ApiName__c');

            results = results.concat(result);
            this.ux.setSpinnerStatus(`\nPushed ${i + chunkSize} of ${records.length} templates`)
        }

        this.ux.stopSpinner();
        this.ux.log(`${chalk.green.bold(records.length + messages.getMessage('push.success'))}`);

        return results;
    }


    private async getLocalTemplate(name: string) {
        if (!await pathExists(`./copado-data/templates/${name}/detail.json`)) {
            throw new Error(`Invalid template ${name}`);
        }

        return await this.asRecord(name);
    }


    private async getAllTemplates() {
        return await Promise.all((await this.getTemplateNames('./copado-data/templates'))
            .map(async (name) => {
                return await this.getLocalTemplate(name);
            }));
    }


    private async getTemplateNames(source): Promise<string[]> {
        return (await readdir(source, { withFileTypes: true }))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }


    private async asRecord(name: string) {
        const detail = await readJson(`./copado-data/templates/${name}/detail.json`);
        const volumeOption = await readFile(`./copado-data/templates/${name}/volumeOption.json`, 'utf8');

        return {
            Name: name,
            copado__Type__c: detail.type,
            copado__ApiName__c: detail.apiName,
            copado__Version__c: detail.version,
            copado__VolumeOptions__c: volumeOption,
            copado__Description__c: detail.description
        };
    }
}
