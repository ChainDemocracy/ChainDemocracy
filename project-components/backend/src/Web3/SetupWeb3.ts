import { Web3 } from 'web3'; //API about coin

export const setupWeb3 = () => {
  const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    throw new Error('Private key not found');
  }

  //GET
  const account = web3.eth.accounts.wallet.add(PRIVATE_KEY);

  // web3.eth.getBalance(account[0].address).then((data) => console.log(data));
  // web3.eth.getChainId(account[0].address).then((data) => console.log(data));
  // web3.eth.getBlockNumber(account[0].address).then((data) => console.log(data));

  // web3.eth
  //    .getTransaction(
  //       '0x5346ef982ee9431118e9a14c7c0ba00a735ead05fec8e0ac1e331e63bdd6da47'
  //    )
  //    .then((data) => console.log(data));

  //https://etherscan.io/token/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984#code
  const uniAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; //Token address

  // const uniToken = new web3.eth.Contract(uniswapAbi, uniAddress);

  // uniToken.methods
  //    .totalSupply()
  //    .call()
  //    .then((data) => console.log(data));
};
