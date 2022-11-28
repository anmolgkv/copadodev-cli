import SObjectSelector from './sObjectSelector';

export default class FunctionSelector extends SObjectSelector {
    fields = ['Id', 'Name', 'copado__API_Name__c', 'copado__ApexClass__c', 'copado__Callback_Type__c', 'copado__Description__c', 'copado__FlowHandler__c', 'copado__Worker_Size__c', 'copado__Options__c', 'copado__Parameters__c', 'copado__Script__c', 'copado__Timeout__c', 'copado__Type__c', 'copado__Version__c', 'copado__Image_Name__c'];
    sObject = 'copado__Function__c';

    public byApiName(apiName) {
        return this.getRecords(`copado__API_Name__c = '${apiName}'`);
    }
}