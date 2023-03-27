import {Table,Entity} from 'dynamodb-toolbox'

import DynamoDB = require('aws-sdk/clients/dynamodb');

const environment = process.env.ENVIRONMENT;
let options;
if(environment === 'local') {
    options={
        endpoint:'http://localhost:8000',
        //region:'your region choose',              //if local environment variables are not set
        // accessKeyId:'your key',         //if local environment variables are not set
        // secretAccessKey:'your secret'   //if local environment variables are not set
    }
}

const DocumentClient = new DynamoDB.DocumentClient(options) 

class DBController{
    static instance: DBController = null;
    static dnaTable = new Table({
        name:'DnaDynamoDbTable',
        partitionKey: 'sequence',
        DocumentClient
    });

    dna_stats:Entity

    constructor(){
        this.dna_stats = new Entity({
            name:'DnaStats',
            attributes:{
                sequence:{partitionKey:true},
                mutation:{type:'boolean'}
            },
            table: DBController.dnaTable

        })
    }

    public static getInstance(){
        if(DBController.instance == null)
            DBController.instance = new DBController();

        return DBController.instance;
    }


}
export{DBController}