import { outputFile } from 'fs-extra';

export default class Template {
    public static async saveInLocal(record) {
        const volumeOption = record.template.volumeOptions ? JSON.stringify(JSON.parse(record.template.volumeOptions), null, 4) : '';
        const detail = record.template.detail ? JSON.stringify(record.template.detail, null, 4) : '';

        await outputFile(`./copado-data/templates/${record.template.detail.apiName}/volumeOption.json`, `${volumeOption}`);
        await outputFile(`./copado-data/templates/${record.template.detail.apiName}/detail.json`, `${detail}`);

        for (const step of record.steps) {
            const configJson = step.configJson ? JSON.stringify(JSON.parse(step.configJson), null, 4) : '';
            const detail = step.detail ? JSON.stringify(step.detail, null, 4) : '';

            await outputFile(`./copado-data/templates/${record.template.detail.apiName}/steps/${step.detail.name}/config.json`, `${configJson}`);
            await outputFile(`./copado-data/templates/${record.template.detail.apiName}/steps/${step.detail.name}/detail.json`, `${detail}`);
        }
    }
}