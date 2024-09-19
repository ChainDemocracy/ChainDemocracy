import Web3 from 'web3';
import { CONTRACT_ID, diceAbi } from './constants/diceAbi';

export const diceContract = (web3: Web3) => {
  return new web3.eth.Contract(diceAbi, CONTRACT_ID);
};
