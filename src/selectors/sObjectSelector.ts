import { RestConnections } from '../services/restConnection';


export default abstract class SObjectSelector {

    protected abstract fields;
    protected abstract sObject;
    protected orderby = 'Name';

    public byId(recordId: string) {
        return this.getRecords(`Id = '${recordId}'`);
    }

    public all() {
        return this.getRecords();
    }

    protected async getRecords(condition?: string) {
        const result = await RestConnections.query(this.queryString(condition));

        return result.records;
    }

    protected queryString(condition?: string) {
        return `SELECT ${this.fields.join(', ')} FROM ${this.sObject} ${this.addFilter(condition)} ${this.orderby ? 'ORDER By ' + this.orderby : ''}`;
    }

    protected addFilter(condition: string) {
        return condition ? ` WHERE ${condition}` : '';
    }
}