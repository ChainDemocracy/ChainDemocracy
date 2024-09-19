import { Web3 } from 'web3'; //API about coin

export const setupWeb3 = () => {
  const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    throw new Error('Private key not found');
  }

  //GET
  const account = web3.eth.accounts.wallet.add(PRIVATE_KEY);
};
