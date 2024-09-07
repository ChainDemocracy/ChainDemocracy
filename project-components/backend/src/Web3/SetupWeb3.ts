import { Web3 } from 'web3'; //API about coin

export const setupWeb3 = () => {
  const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    throw new Error('Private key not found');
  }

  //GET
  const account = web3.eth.accounts.wallet.add(PRIVATE_KEY);
  // console.log('Backend', account);

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

  //POST
  const to = '0x508148D65644253ACB0157ee87583107F7B803A3';
  const from = '0x018Bac394e3612e25EF80e8A184957E316D210aA';

  const value = web3.utils.toWei('0.01', 'ether');

  // uniToken.methods
  //    .balanceOf(account[0].address)
  //    .call()
  //    .then((balance) => {
  //       console.log('Balance:', web3.utils.fromWei(balance, 'ether'));
  //       if (parseFloat(balance) < parseFloat(value)) {
  //          console.error('Insufficient balance to make the transfer');
  //       } else {
  //          // Виконати трансакцію, якщо баланс достатній
  //          uniToken.methods
  //             .transfer(to, value)
  //             .send({ from: from })
  //             .then((data) => console.log('txReceipt', data))
  //             .catch((err) => console.error('Transaction failed', err));
  //       }
  //    })
  //    .catch((err) => console.error('Error fetching balance', err));

  // uniToken.methods
  //    .transfer(to, value)
  //    .send({ from: account[0].address })
  //    .then((data) => console.log('txReceipt', data));

  console.log('value', value);
  //   web3.eth
  //     .getBalance(account[0].address)
  //     .then((balance) => {
  //       console.log('Balance:', web3.utils.fromWei(balance, 'ether'));

  //       web3.eth
  //         .sendTransaction({
  //           from: account[0].address,
  //           to: to,
  //           value: value,
  //           gas: 21000,
  //         })
  //         .then((receipt) => {
  //           console.log('Transaction receipt:', receipt);
  //         })
  //         .catch((error) => {
  //           console.error('Transaction error:', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching balance:', error);
  //     });
};
