import Web3 from 'web3';
import { diceAbi } from './constants/diceAbi';

export const diceContract = (web3: Web3) => {
  return new web3.eth.Contract(
    diceAbi,
    '0x9d29013D03A2cdBB8F40DAEE959e37538C21ed97',
  );
};
