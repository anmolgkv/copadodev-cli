import * as os from 'os';
import chalk from 'chalk';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { prompt } from '@oclif/core/lib/cli-ux/prompt';
import { flags, SfdxCommand } from '@salesforce/command';

import Function from '../../services/function';
import FunctionSelector from '../../selectors/functionSelector'


Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('copadoDev', 'function');

export default class CreateFunction extends SfdxCommand {
    public static description = messages.getMessage('new.description');
    public static examples = messages.getMessage('new.examples').split(os.EOL);

    protected static flagsConfig = {
        name: flags.string({
            char: 'n',
            description: messages.getMessage('new.flags.name.description'),
        }),
        type: flags.enum({
            char: 't',
            description: messages.getMessage('new.flags.type.description'),
            options: ['shell', 'python', 'nodejs']
        })
    };


    public async run(): Promise<AnyJson> {
        const name = this.flags.name as string || await prompt("Please enter function Name");
        const type = (this.flags.type || 'shell') as string;
        const templateFunction = this.templates[type];

        await this.assertFunction(name);
        await Function.saveInLocal({ name, function: {...templateFunction} });

        this.ux.log(`${chalk.green.bold(messages.getMessage('new.success'))}`);

        return templateFunction;
    }


    private async assertFunction(name) {
        this.ux.startSpinner(messages.getMessage('new.validating'));
        const result = await new FunctionSelector().byApiName(name);
        this.ux.stopSpinner();

        if (result.length) {
            throw new Error(`Function ${name} already exists \n run sfdx copadodev:functon:pull to retrieve latest changes`)
        }
    }


    private templates = {
        shell: {
            script: `echo Hello $parameter`,
            detail: {
                imageName: "copado-function-core:v1",
                version: "0.1",
                type: "Custom",
                timeout: null,
                options: null,
                size: "S",
                flowHandler: "",
                description: "",
                callbackType: "",
                apexClass: "",
                lang: "shell"
            },
            parameters: [{
                "name": "parameter",
                "defaultValue": "world"
            }]
        },
        python: {
            script: `#!/usr/bin/env python \n print("Hello os.environ['parameter']")`,
            detail: {
                imageName: "copado-function-core:v1",
                version: "0.1",
                type: "Custom",
                timeout: null,
                options: null,
                size: "S",
                flowHandler: "",
                description: "",
                callbackType: "",
                apexClass: "",
                lang: "python"
            },
            parameters: [{
                "name": "parameter",
                "defaultValue": "world"
            }]
        },
        nodejs: {
            script: '#!/usr/bin/env node \n console.log(`Hello ${process.env.parameter}`);',
            detail: {
                imageName: "copado-function-core:v1",
                version: "0.1",
                type: "Custom",
                timeout: null,
                options: null,
                size: "S",
                flowHandler: "",
                description: "",
                callbackType: "",
                apexClass: "",
                lang: "nodejs"
            },
            parameters: [{
                "name": "parameter",
                "defaultValue": "world"
            }]
        }
    };
}
