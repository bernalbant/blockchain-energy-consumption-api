import {SchemaComposer} from 'graphql-compose';
import {createTransactionEnergyTC} from './types/transactionEnergy';
import {createDailyEnergyConsumptionTC} from './types/dailyEnergyConsumption';
import {addTransactionEnergyResolvers} from './resolvers/transactionEnergyResolver';
import {addDailyEnergyConsumptionResolvers} from './resolvers/dailyEnergyConsumptionResolver';

export const schemaComposer = new SchemaComposer();

const TransactionEnergyTC = createTransactionEnergyTC(schemaComposer);

schemaComposer.Query.addFields({
    energyConsumptionPerTransaction: {
        type: [TransactionEnergyTC],
        args: {
            blockHash: 'String!'
        },
        resolve: (_, args) => TransactionEnergyTC.getResolver('computeEnergy').resolve({args})
    }
});

addTransactionEnergyResolvers(schemaComposer);


const DailyEnergyConsumptionTC = createDailyEnergyConsumptionTC(schemaComposer);

schemaComposer.Query.addFields({
    dailyEnergyConsumption: {
        type: [DailyEnergyConsumptionTC],
        args: {
            days: 'Int!'
        },
        resolve: (_, args) => DailyEnergyConsumptionTC.getResolver('computeDailyEnergy').resolve({args})
    }
});

addDailyEnergyConsumptionResolvers(schemaComposer);

export const schema = schemaComposer.buildSchema();
