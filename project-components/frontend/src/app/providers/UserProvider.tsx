//@ts-nocheck
import {
   createContext,
   FC,
   PropsWithChildren,
   useEffect,
   useState
} from 'react';

export interface UserProfile {
   walletId: string;
   connectWallet: () => void;
}

export const UserContext = createContext<UserProfile | null>(null);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
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

   return (
      <UserContext.Provider value={{ walletAddress, connectWallet }}>
         {children}
      </UserContext.Provider>
   );
};
