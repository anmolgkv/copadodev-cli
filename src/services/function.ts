import { outputFile } from 'fs-extra';

export default class Function {
    public static async saveInLocal(record) {
        const script = record.function.script || '';
        const parameter = record.function.parameters ? JSON.stringify(record.function.parameters, null, 4) : '';
        const detail = record.function.detail ? JSON.stringify(record.function.detail, null, 4) : '';

        await outputFile(`./copado-data/functions/${record.name}/${this.getFileName(record.function.detail.lang)}`, script);
        await outputFile(`./copado-data/functions/${record.name}/parameter.json`, `${parameter}`);
        await outputFile(`./copado-data/functions/${record.name}/details.json`, `${detail}`);
    }


    private static getFileName(type: string): string {
        if (type === 'shell') return 'script.sh';
        else if (type === 'nodejs') return 'script.js';
        else if (type === 'python') return 'script.py';
        else throw new Error(`Invalid type ${type}`);
    }
}