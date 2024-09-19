import { UserContext } from 'app/providers/UserProvider';
import { diceContract } from 'blockchain/dice';
import { Button, TextInput } from 'flowbite-react';
import { useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface Web3InviteFormType {
  userBId: string;
  bet: string;
}

export const Web3InviteForm = () => {
  const user = useContext(UserContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Web3InviteFormType>({
    mode: 'onBlur',
    defaultValues: {
      userBId: '0x508148d65644253acb0157ee87583107f7b803a3',
      bet: '0.0000001',
    },
  });

  const localContract = useMemo(() => {
    if (user?.web3) {
      return diceContract(user.web3);
    }
    return null;
  }, [user?.web3]);

  const enterChargeHandler = async ({ bet, userBId }: Web3InviteFormType) => {
    try {
      console.log('bet', bet, userBId);
      if (localContract && user?.walletAddress) {
        const betInWei = user.web3.utils.toWei(bet, 'ether');
        const result = await localContract.methods.createGame(userBId).send({
          from: user.walletAddress,
          value: betInWei,
          gas: '300000',
        });
        console.log('result', result);
      }
    } catch (err) {
      const error = err as unknown as Error;
      console.log('err', error.message);
      setError('root', {
        message: error.message,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(enterChargeHandler)}>
        <div className="p-4 flex flex-col justify-center items-center gap-2">
          <TextInput
            color="gray"
            required
            className="w-[500px]"
            {...register('userBId')}
            placeholder="Wallet id, ex 0x5f80Dd735F..."
          />
          <TextInput
            color="gray"
            type="number"
            step="0.000000001"
            className="w-[500px]"
            {...register('bet')}
            placeholder="Bet, ex 0.000001"
          />

          <div className="flex flex-col gap-2">
            <Button disabled={isSubmitting} type="submit">
              Send invite
            </Button>
            {errors?.root && (
              <div className="w-full mt-1 text-purple-600 text-sm">
                {errors.root.message}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
