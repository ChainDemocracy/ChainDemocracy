import Web3 from 'web3';
import { diceAbi } from './constants/diceAbi';

export const diceContract = (web3: Web3) => {
  return new web3.eth.Contract(
    diceAbi,
    '0xA8E92954F28c2FF12883a4bdDD27684ca5A9d98C',
  );
};
