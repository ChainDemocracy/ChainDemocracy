//@ts-nocheck
import { useEffect, useState } from 'react';
import './App.css';
import { notifyInfo } from './utils/ToastifyInfo';
import { InviteForm } from './components/InviteForm/InviteForm';

function App() {
   const [walletAddress, setWalletAddress] = useState('');
   const connectWallet = async () => {
      if (
         typeof window != 'undefined' &&
         typeof window.ethereum != 'undefined'
      ) {
         try {
            /* MetaMask is installed */
            const accounts = await window.ethereum.request({
               method: 'eth_requestAccounts'
            });
            setWalletAddress(accounts[0]);
            console.log(accounts[0]);
         } catch (err: any) {
            console.error(err.message);
         }
      } else {
         /* MetaMask is not installed */
         notifyInfo('MetaMask is not installed', '🙈', 'top-center');
         console.log('Please install MetaMask');
      }
   };

   const getCurrentWalletConnected = async () => {
      if (
         typeof window != 'undefined' &&
         typeof window.ethereum != 'undefined'
      ) {
         try {
            const accounts = await window.ethereum.request({
               method: 'eth_accounts'
            });
            if (accounts.length > 0) {
               setWalletAddress(accounts[0]);
               console.log(accounts[0]);
            } else {
               console.log('Connect to MetaMask using the Connect button');
            }
         } catch (err) {
            console.error(err.message);
         }
      } else {
         /* MetaMask is not installed */
         notifyInfo('MetaMask is not installed', '🙈', 'top-center');
         console.log('Please install MetaMask');
      }
   };

   const addWalletListener = async () => {
      if (
         typeof window != 'undefined' &&
         typeof window.ethereum != 'undefined'
      ) {
         window.ethereum.on('accountsChanged', (accounts) => {
            setWalletAddress(accounts[0]);
            console.log(accounts[0]);
         });
      } else {
         /* MetaMask is not installed */
         setWalletAddress('');
         notifyInfo('MetaMask is not installed', '🙈', 'top-center');
         console.log('Please install MetaMask');
      }
   };

   useEffect(() => {
      getCurrentWalletConnected();
      addWalletListener();
   }, [walletAddress]);

   const hasWallet = walletAddress && walletAddress.length > 0;

   return (
      <div className='w-full h-screen bg-gray-900 flex flex-col gap-4 items-center justify-center'>
         {hasWallet ? (
            <p className='text-gray-100'>
               Your address: {walletAddress.substring(0, 6)}...
               {walletAddress.substring(38)}
            </p>
         ) : (
            <button
               onClick={connectWallet}
               className='bg-purple-700 rounded-xl text-white flex items-center justify-center text-center px-8 py-4 hover:bg-purple-800 text-3xl'
            >
               Connect wallet
            </button>
         )}
         {hasWallet && <InviteForm walletAddress={walletAddress} />}
      </div>
   );
}

export default App;
