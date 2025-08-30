// Define types for the blockchain data
export interface IBlockData {
    tx: ITransaction[];
    // Include other block properties as needed
}

export interface ITransaction {
    hash: string;
    size: number;
    // Include other transaction properties as needed
}

export interface IResolverArgs {
    blockHash: string;
}
