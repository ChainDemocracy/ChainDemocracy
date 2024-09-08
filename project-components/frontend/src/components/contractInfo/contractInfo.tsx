import { UserContext } from 'app/providers/UserProvider';
import { diceContract } from 'blockchain/dice';
import { useContext, useMemo, useState } from 'react';

export const ContractInfo = () => {
  const user = useContext(UserContext);

  // eslint-disable-next-line
  const [balance, setBalance] = useState<any>(null);

  const localContract = useMemo(() => {
    if (user?.web3) {
      return diceContract(user.web3);
    }
    return null;
  }, [user?.web3]);

  const getContractInfo = async () => {
    if (localContract) {
      try {
        const balanceResult = await localContract.methods
          .getContractBalance()
          .call();

        setBalance(Number(balanceResult));
      } catch (error) {
        console.error('Failed to fetch contract info:', error);
      }
    }
  };

  const enterChargeHandler = async () => {
    try {
      if (localContract && user?.walletAddress) {
        const result = await localContract.methods.charge().send({
          from: user.walletAddress,
          value: '15000000000000000',
          gas: '300000',
        });
        console.log('result', result);
      }
    } catch (err) {
      const error = err as unknown as Error;
      console.log('err', error.message);
    }
  };

  const enterWithdrawHandler = async () => {
    try {
      if (localContract && user?.walletAddress) {
        const result = await localContract.methods.withdraw().send({
          from: user.walletAddress,
          gas: '300000',
        });
        console.log('result', result);
      }
    } catch (err) {
      const error = err as unknown as Error;
      console.log('err', error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center text-gray-100">
      <button
        className="bg-gray-500 rounded-full px-2 py-4 "
        onClick={getContractInfo}
      >
        Get info
      </button>
      {balance && <p>{balance}</p>}
      <button
        onClick={enterChargeHandler}
        className="bg-gray-700 rounded-full px-2 py-4 "
      >
        charge
      </button>

      <button
        onClick={enterWithdrawHandler}
        className="bg-gray-600 rounded-full px-2 py-4 "
      >
        Withdraw
      </button>
    </div>
  );
};
