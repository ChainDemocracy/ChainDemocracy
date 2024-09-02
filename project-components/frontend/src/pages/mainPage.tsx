//@ts-nocheck
import { useContext } from 'react';
import { InviteForm } from '../components/InviteForm/InviteForm';
import { UserContext } from '../app/providers/UserProvider';

export const MainPage = () => {
   const { walletAddress, connectWallet } = useContext(UserContext);

   const hasWallet = walletAddress && walletAddress.length > 0;
   return (
      <>
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
      </>
   );
};
