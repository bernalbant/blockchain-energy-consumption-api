import { getBlockData } from '../../api/blockchainAPI';
import { ENERGY_COST_PER_BYTE } from '../../utils/constants';
import { SchemaComposer } from 'graphql-compose';
import { IBlockData, ITransaction, IResolverArgs } from '../../types';

export function addTransactionEnergyResolvers(schemaComposer: SchemaComposer<any>) {
  const TransactionEnergyTC = schemaComposer.getOTC('TransactionEnergy');

  TransactionEnergyTC.addResolver({
    name: 'computeEnergy',
    type: [TransactionEnergyTC],
    args: { blockHash: 'String!' },
    resolve: async ({ args }: { args: IResolverArgs }) => {
      const block: IBlockData = await getBlockData(args.blockHash);
      return block.tx.map((transaction: ITransaction) => ({
        transactionId: transaction.hash,
        energyConsumed: transaction.size * ENERGY_COST_PER_BYTE
      }));
    }
  });
}
