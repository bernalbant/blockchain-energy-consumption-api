import axios from 'axios';

export async function getBlockData(blockHash: string) {
  const url = `https://blockchain.info/rawblock/${blockHash}`;
  return axios.get(url).then(response => response.data);
}