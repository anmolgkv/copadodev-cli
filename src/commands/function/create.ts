import * as os from 'os';
import { outputFile } from 'fs-extra';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { prompt } from '@oclif/core/lib/cli-ux/prompt';
import { flags, SfdxCommand } from '@salesforce/command';


Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('copadoDev', 'function');

export default class CreateFunction extends SfdxCommand {
    public static description = messages.getMessage('new.description');
    public static examples = messages.getMessage('new.examples').split(os.EOL);

    protected static requiresUsername = true;
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

        await outputFile(`./copado-data/functions/${name}/${this.getFileName(type) }`, templateFunction.script);
        await outputFile(`./copado-data/functions/${name}/parameter.json`, `${JSON.stringify(templateFunction.parameters, null, 4)}`);
        await outputFile(`./copado-data/functions/${name}/details.json`, `${JSON.stringify(templateFunction.detail, null, 4)}`);

        return templateFunction;
    }


    private getFileName(type: string) : string {
        if (type === 'shell') return 'script.sh';
        else if (type === 'nodejs') return 'script.js';
        else if (type === 'python') return 'script.py';
        else throw new Error(`Invalid type ${type}`);
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
                apexClass: ""
            },
            parameters: [{
                "name": "parameter",
                "value": "world"
            }]
        },
        python: {
            script: `print("Hello os.environ['parameter']")`,
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
                apexClass: ""
            },
            parameters: [{
                "name": "parameter",
                "value": "world"
            }]
        },
        nodejs: {
            script: 'console.log(`Hello ${process.env.parameter}`);',
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
                apexClass: ""
            },
            parameters: [{
                "name": "parameter",
                "value": "world"
            }]
        }
    };
}
