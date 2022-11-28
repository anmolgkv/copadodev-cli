import { ConfigFile } from '@salesforce/core';
import * as os from 'os';
import * as path from 'path';

// tslint:disable-next-line:no-var-requires
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


export const COPADO_NAMESPACE = process.env.COPADO_NAMESPACE;


export class CopadoFiles {

    public static async getCurrentUser() {
        return this.getCopadoConfigFile(os.homedir()).then(content => content.getContents().currentuser as string);
    }

    private static async getCopadoConfigFile(folder: string) {
        const configObj: object = {
            rootFolder: folder,
            filename: 'copado-config.json',
            isGlobal: false,
            isState: false,
            filePath: '.copado'
        };
        return ConfigFile.create(configObj);
    }

}