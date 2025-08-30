import { SchemaComposer } from 'graphql-compose';

export function createTransactionEnergyTC(schemaComposer: SchemaComposer<any>) {
    return schemaComposer.createObjectTC({
        name: 'TransactionEnergy',
        fields: {
            transactionId: 'String!',
            energyConsumed: 'Float!'
        }
    });
}