import axios from 'axios';
import { ENERGY_COST_PER_BYTE } from '../../utils/constants';
import { getBlockData } from '../../api/blockchainAPI';
import { SchemaComposer } from 'graphql-compose';
import { IBlockData, IResolverArgs } from '../../types';

export function addDailyEnergyConsumptionResolvers(schemaComposer: SchemaComposer<any>) {
  const DailyEnergyConsumptionTC = schemaComposer.getOTC('DailyEnergyConsumption');

  DailyEnergyConsumptionTC.addResolver({
    name: 'computeDailyEnergy',
    type: [DailyEnergyConsumptionTC],
    args: {days: 'Int!'},
    resolve: async ({ args }: { args: { days: number } }) => {
      let currentDayMidnight = new Date();
      currentDayMidnight.setUTCHours(0, 0, 0, 0);

      const results = [];
      for (let day = 0; day < args.days; day++) {
        console.log(day);
        const dayTimestamp = new Date(currentDayMidnight).setDate(currentDayMidnight.getDate() - day);
        const blocksData = await getBlockDataForDay(dayTimestamp);
        const totalEnergyConsumed = blocksData.reduce((acc, block) => {
          const blockEnergy = block.tx.reduce((txAcc, tx) => txAcc + tx.size * ENERGY_COST_PER_BYTE, 0);
          return acc + blockEnergy;
        }, 0);

        results.push({
          date: new Date(dayTimestamp).toISOString().split('T')[0],
          energyConsumed: totalEnergyConsumed,
        });
      }
      return results;
    }
  });

  schemaComposer.Query.addFields({
    totalEnergyConsumptionPerDay: DailyEnergyConsumptionTC.getResolver('computeDailyEnergy'),
  });
}

async function getBlockDataForDay(dayTimestamp: number): Promise<IBlockData[]> {
  const url = `https://blockchain.info/blocks/${dayTimestamp}?format=json`;
  try {
    const response = await axios.get(url);

    // Additional check to log and validate the response structure
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid or missing "data" property in response:', response.data);
      throw new Error('Invalid or missing data in API response');
    }

    // If the data is directly an array, use it, otherwise, expect 'blocks' property
    const blocks = Array.isArray(response.data) ? response.data : response.data.-+++++;
    if (!blocks) {
      console.error('Missing "blocks" property in API response:', response.data);
      throw new Error('Missing "blocks" property in API response');
    }

    return await Promise.all(blocks.map((block: { hash: string; }) => getBlockData(block.hash)));
  } catch (error) {
    console.error('Failed to fetch block data:', error);
    throw new Error('Blockchain API request failed: ' + error.message);
  }
}
