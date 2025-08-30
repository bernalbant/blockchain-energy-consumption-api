import axios from 'axios';
import { IBlockData } from '../types';
import { ENERGY_COST_PER_BYTE } from '../utils/constants';

export default async function getBlockDataForDay(event: { body: string; }){

  const blocks: IBlockData[] = [];
  const data = JSON.parse(event.body)
  try {
    const response = await axios.get(`https://blockchain.info/blocks/${data.timestamp}?format=json`);
    console.log(response.data[0]);
    for (const block of response.data) {
      const blockResponse = await axios.get(`https://blockchain.info/rawblock/${block.hash}`);
      const blockData: IBlockData = {
        tx: blockResponse.data.tx.map((tx: any) => ({
          hash: tx.hash,
          size: tx.size * ENERGY_COST_PER_BYTE,
        })),
      };
      blocks.push(blockData);
    }
    
    return blocks;

  } catch (error) {
    console.error('Error fetching block data:', error);
    // Handle rate limiting or other errors appropriately here
    throw error; // Re-throw the error for the caller to handle
  }
}
