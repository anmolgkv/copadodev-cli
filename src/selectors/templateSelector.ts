import SObjectSelector from './sObjectSelector';

export default class TemplateSelector extends SObjectSelector {
    fields = ['Id', 'Name', 'copado__ApiName__c', 'copado__Description__c', 'copado__Type__c', 'copado__Version__c', 'copado__VolumeOptions__c',
                '(SELECT Id, Name, copado__ApiName__c, copado__ConfigJson__c, copado__JobTemplate__c, copado__Order__c, copado__Type__c, copado__CustomType__c, copado__ExecutionSequence__c FROM copado__JobSteps__r)'
            ];

    sObject = 'copado__JobTemplate__c';

    public byApiName(apiName) {
        return this.getRecords(`copado__ApiName__c = '${apiName}'`);
    }
}