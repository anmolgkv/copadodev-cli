import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

Messages.importMessagesDirectory(__dirname);

const messages = Messages.loadMessages('copadoDev', 'function');

export default class CreateFunction extends SfdxCommand {
    public static description = messages.getMessage('new.description');

    public static examples = messages.getMessage('new.examples').split(os.EOL);

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        name: flags.string({
            char: 'n',
            required: true,
            description: messages.getMessage('new.flags.name.description'),
        }),
        type: flags.enum({
            char: 't',
            description: messages.getMessage('new.flags.type.description'),
            options: ['shell', 'python', 'nodejs']
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<AnyJson> {
        const name = this.flags.name as string;
        const type = (this.flags.name || 'shell') as string;
        console.log('type: ', type);
        const conn = this.org.getConnection();
        const query = 'Select Name, TrialExpirationDate from Organization';

        // The type we are querying for
        interface Organization {
            Name: string;
            TrialExpirationDate: string;
        }

        // Query the org
        const result = await conn.query<Organization>(query);

        // Organization will always return one result, but this is an example of throwing an error
        // The output and --json will automatically be handled for you.
        if (!result.records || result.records.length <= 0) {
            throw new SfError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }

        // Organization always only returns one result
        const orgName = result.records[0].Name;
        const trialExpirationDate = result.records[0].TrialExpirationDate;

        let outputString = `Hello ${name}! This is org: ${orgName}`;
        if (trialExpirationDate) {
            const date = new Date(trialExpirationDate).toDateString();
            outputString = `${outputString} and I will be around until ${date}!`;
        }
        this.ux.log(outputString);

        // this.hubOrg is NOT guaranteed because supportsHubOrgUsername=true, as opposed to requiresHubOrgUsername.
        if (this.hubOrg) {
            const hubOrgId = this.hubOrg.getOrgId();
            this.ux.log(`My hub org id is: ${hubOrgId}`);
        }

        if (this.flags.force && this.args.file) {
            this.ux.log(`You input --force and a file: ${this.args.file as string}`);
        }

        // Return an object to be displayed with --json
        return { orgId: this.org.getOrgId(), outputString };
    }
}
