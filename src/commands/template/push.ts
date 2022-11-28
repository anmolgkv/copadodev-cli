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

    private templates = [];
    private steps = [];

    public async run(): Promise<AnyJson> {
        let templateResults = [];
        let stepResults = [];

        const name = this.flags.name as string;
        if(name) {
            await this.getLocalTemplate(name);
        } else {
            await this.getAllTemplates();
        }

        this.ux.startSpinner(messages.getMessage('push.pushingTemplate'));

        const chunkSize = 9;

        for (let i = 0; i < this.templates.length; i += chunkSize) {
            const chunk = this.templates.slice(i, i + chunkSize);
            const templateResult = await RestConnections.upsert('copado__JobTemplate__c', chunk, 'copado__ApiName__c');

            templateResults = templateResults.concat(templateResult);
            this.ux.setSpinnerStatus(`\nPushed ${templateResults.length} of ${this.templates.length} templates`)
        }

        for (let i = 0; i < this.steps.length; i += chunkSize) {
            const chunk = this.steps.slice(i, i + chunkSize);
            const stepResult = await RestConnections.upsert('copado__JobStep__c', chunk, 'Id');

            stepResults = stepResults.concat(stepResult);
            this.ux.setSpinnerStatus(`\nPushed ${stepResults.length} of ${this.steps.length} steps`)
        }

        this.ux.stopSpinner();
        this.ux.log(`${chalk.green.bold(templateResults.length + ' Template(s) and ' + stepResults.length + ' Step(s) ' + messages.getMessage('push.success'))}`);

        return {
            templateResults, stepResults
        };
    }


    private async getLocalTemplate(name: string) {
        if (!await pathExists(`./copado-data/templates/${name}/detail.json`)) {
            throw new Error(`Invalid template ${name}`);
        }

        await this.asRecord(name);
    }


    private async getAllTemplates() {
        const templateNames = await this.getDirectoryNames('./copado-data/templates');

        for (const templateName of templateNames) {
            await this.getLocalTemplate(templateName);
        }
    }


    private async getDirectoryNames(source): Promise<string[]> {
        return (await readdir(source, { withFileTypes: true }))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }


    private async asRecord(name: string) {
        const detail = await readJson(`./copado-data/templates/${name}/detail.json`);
        const volumeOption = await readFile(`./copado-data/templates/${name}/volumeOption.json`, 'utf8');

        this.templates.push({
            Name: detail.name,
            copado__Type__c: detail.type,
            copado__ApiName__c: detail.apiName,
            copado__Version__c: detail.version,
            copado__VolumeOptions__c: volumeOption,
            copado__Description__c: detail.description
        });

        const steps = await this.stepsFor(name);
        this.steps = this.steps.concat(steps);
    }


    private async stepsFor(templateName: string) {
        const stepRootFolder = `./copado-data/templates/${templateName}/steps`;

        if (!await pathExists(stepRootFolder)) return [];

        return await Promise.all((await this.getDirectoryNames(stepRootFolder))
            .map(async (stepName) => {
                return await this.getLocalStep(templateName, stepName);
            }));
    }


    private async getLocalStep(templateName: string, stepName: string) {
        const configJson = await readJson(`./copado-data/templates/${templateName}/steps/${stepName}/config.json`);
        const detail = await readJson(`./copado-data/templates/${templateName}/steps/${stepName}/detail.json`);

        return {
            Id: detail.id,
            Name: detail.name,
            copado__Type__c: detail.type,
            copado__Order__c: detail.order,
            copado__ApiName__c: detail.apiName,
            copado__CustomType__c: detail.customType,
            copado__JobTemplate__c: detail.jobTemplate,
            copado__ConfigJson__c: JSON.stringify(configJson),
            copado__ExecutionSequence__c: detail.executionSequence
        };
    }
}
