import * as os from 'os';
import chalk from 'chalk';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { flags, SfdxCommand } from '@salesforce/command';

import Template from '../../services/template';
import TemplateSelector from '../../selectors/templateSelector'

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('copadodev-cli', 'template');

export default class PullTemplate extends SfdxCommand {
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

        this.ux.startSpinner(messages.getMessage('pull.fetchingTemplate'));
        const records = name ? await new TemplateSelector().byApiName(name) : await new TemplateSelector().all();

        if (!records.length) {
            throw new Error(`Template ${name}, does not exist`);
        }
        else {
            for (const record of records) {
                const localTemplate = this.asTemplate(record);
                await Template.saveInLocal(localTemplate);
            }
        }
        this.ux.stopSpinner();
        this.ux.log(`${chalk.green.bold(records.length + messages.getMessage('pull.success'))}`);
        return records;
    }

    private asTemplate(record: any) {
        const jobSteps = record.copado__JobSteps__r || record.JobSteps__r || { records : []};

        return {
            template: {
                volumeOptions: record.copado__VolumeOptions__c || record.VolumeOptions__c || '',
                detail: {
                    id: record.Id,
                    name: record.Name,
                    type: record.copado__Type__c || record.Type__c,
                    version: record.copado__Version__c || record.Version__c,
                    apiName: record.copado__ApiName__c || record.ApiName__c,
                    description: record.copado__Description__c || record.Description__c
                }
            },
            steps: jobSteps.records.map(jobStep => {
                return {
                    configJson: jobStep.copado__ConfigJson__c || jobStep.ConfigJson__c || '',
                    detail: {
                        name: jobStep.Name,
                        type: jobStep.copado__Type__c || jobStep.Type__c,
                        order: jobStep.copado__Order__c || jobStep.Order__c,
                        apiName: jobStep.copado__ApiName__c || jobStep.ApiName__c,
                        customType: jobStep.copado__CustomType__c || jobStep.CustomType__c,
                        jobTemplate: jobStep.copado__JobTemplate__c || jobStep.JobTemplate__c,
                        executionSequence: jobStep.copado__ExecutionSequence__c || jobStep.ExecutionSequence__c
                    }
                }
            })
        };
    }
}
