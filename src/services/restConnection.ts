import { QueryResult } from 'jsforce';
import { AuthInfo, Connection } from '@salesforce/core';
import { CopadoFiles, COPADO_NAMESPACE } from './filesystem';

export class RestConnections {

    public static async query(queryString: string): Promise<QueryResult<any>> {
        const username = await CopadoFiles.getCurrentUser();
        const connection = await Connection.create({ authInfo: await AuthInfo.create({ username }) });

        return connection.query(RestConnections.stripNamespace(queryString));
    }

    public static async upsert(type: string, records, extIdField: string): Promise<any> {
        const username = await CopadoFiles.getCurrentUser();
        const connection = await Connection.create({ authInfo: await AuthInfo.create({ username }), connectionOptions: { maxRequest: 1000 } });

        type = RestConnections.stripNamespace(type);
        extIdField = RestConnections.stripNamespace(extIdField);
        records = JSON.parse(RestConnections.stripNamespace(JSON.stringify(records)));

        return connection.sobject(type).upsert(records, extIdField);
    }

    public static async delete(type: string, ids: string[]): Promise<any> {
        const username = await CopadoFiles.getCurrentUser();
        const connection = await Connection.create({ authInfo: await AuthInfo.create({ username }), connectionOptions: { maxRequest: 1000 } });

        return connection.sobject(type).delete(ids);
    }

    private static stripNamespace(data: string) {
        return COPADO_NAMESPACE ? data : data.replace(/copado__/g, '');;
    }
}
