import Web3 from 'web3';
import { diceAbi } from './constants/diceAbi';

export const diceContract = (web3: Web3) => {
  return new web3.eth.Contract(
    diceAbi,
    '0x5f80Dd735F1e554b7ddAbAb727916770043C849b',
  );
};
