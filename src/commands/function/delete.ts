import * as os from 'os';
import chalk from 'chalk';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { pathExists, readJson, remove } from 'fs-extra';

import { flags, SfdxCommand } from '@salesforce/command';
import { RestConnections } from '../../services/restConnection';

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('@copado/copadodev-cli', 'function');

export default class CreateFunction extends SfdxCommand {
    public static description = messages.getMessage('delete.description');
    public static examples = messages.getMessage('delete.examples').split(os.EOL);

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            required: true,
            description: messages.getMessage('delete.flags.name.description'),
        })
    };


    public async run(): Promise<AnyJson> {
        const name = this.flags.name as string

        if (!await pathExists(`./copado-data/functions/${name}/details.json`)) {
            throw new Error(`Invalid function ${name}`);
        }
        this.ux.startSpinner(messages.getMessage('delete.deleting'))
        const detail = await readJson(`./copado-data/functions/${name}/details.json`);
        await RestConnections.delete('copado__Function__c', [detail.id]);
        await remove(`./copado-data/functions/${name}`);
        this.ux.stopSpinner();

        this.ux.log(`${chalk.green.bold(messages.getMessage('delete.success'))}`);

        return {};
    }
}
