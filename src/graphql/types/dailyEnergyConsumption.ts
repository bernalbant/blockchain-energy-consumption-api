import { SchemaComposer } from 'graphql-compose';

export function createDailyEnergyConsumptionTC(schemaComposer: SchemaComposer<any>) {
    return schemaComposer.createObjectTC({
        name: 'DailyEnergyConsumption',
        fields: {
            date: 'String!',
            energyConsumed: 'Float!'
        }
    });
}