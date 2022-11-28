import * as os from 'os';
import chalk from 'chalk';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { flags, SfdxCommand } from '@salesforce/command';

import Function from '../../services/function';
import FunctionSelector from '../../selectors/functionSelector'

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('copadodev-cli', 'function');

export default class PullFunction extends SfdxCommand {
    public static description = messages.getMessage('pull.description');
    public static examples = messages.getMessage('pull.examples').split(os.EOL);

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: messages.getMessage('pull.flags.name.description'),
        })
    };


    public async run(): Promise<AnyJson> {
        const name = this.flags.name as string;

        this.ux.startSpinner(messages.getMessage('pull.fetchingFunction'));
        const records = name ? await new FunctionSelector().byApiName(name) : await new FunctionSelector().all();

        if (!records.length) {
            throw new Error(`Function ${name}, does not exist`);
        }
        else {
            records.forEach(async (record) => {
                const localFunction = this.asFunction(record);
                await Function.saveInLocal(localFunction);
            });
        }
        this.ux.stopSpinner();
        this.ux.log(`${chalk.green.bold(records.length + messages.getMessage('pull.success'))}`);
        return records;
    }

    private asFunction(record: any) {
        return {
            name: record.copado__API_Name__c || record.API_Name__c,
            function: {
                parameters: record.copado__Parameters__c ? JSON.parse(record.copado__Parameters__c) : (record.Parameters__c ? JSON.parse(record.Parameters__c) :  []),
                script: record.copado__Script__c || record.Script__c,
                detail: {
                    id: record.Id,
                    Name: record.Name,
                    imageName: record.copado__Image_Name__c || record.Image_Name__c,
                    version: record.copado__Version__c || record.Version__c,
                    type: record.copado__Type__c || record.Type__c,
                    timeout: record.copado__Timeout__c || record.Timeout__c,
                    options: record.copado__Options__c || record.Options__c,
                    size: record.copado__Worker_Size__c || record.Worker_Size__c,
                    flowHandler: record.copado__FlowHandler__c || record.FlowHandler__c,
                    description: record.copado__Description__c || record.Description__c,
                    callbackType: record.copado__Callback_Type__c || record.Callback_Type__c,
                    apexClass: record.copado__ApexClass__c || record.ApexClass__c,
                    lang: this.lang(record.copado__Script__c || record.Script__c)
                }
            }
        };
    }

    private lang(script: string) : string {
        if (script && script.startsWith('#!/usr/bin/env node')) {
            return 'nodejs';
        } else if (script && script.startsWith('#!/usr/bin/env python')) {
            return 'python';
        }

        return 'shell';
    }
}
