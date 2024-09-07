import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { WebSocketContext } from 'app/providers/SocketProvider';
import { InviteStatus } from 'pages/mainPage';

interface InviteFormType {
  walletId: string;
  bet: number;
}
export const InviteForm = ({
  walletOwnerAddress,
  setInviteStatus,
}: {
  walletOwnerAddress: string;
  setInviteStatus: (status: InviteStatus | null) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InviteFormType>({
    mode: 'onBlur',
  });
  const wsContext = useContext(WebSocketContext);
  const handleClickSendInvite = async ({ walletId, bet }: InviteFormType) => {
    if (!wsContext) return;
    const { socket } = wsContext;

    if (socket && socket.connected) {
      socket.emit('invite', {
        from: walletOwnerAddress,
        to: walletId,
        bet,
      });
      setInviteStatus(InviteStatus.SENT);
      console.log('Invite sent:', {
        from: walletOwnerAddress,
        to: walletId,
        bet,
      });
    } else {
      console.error('Socket.io is not connected');
    }
  };

  const inputClassName =
    'flex rounded-full p-2 min-w-96 bg-gray-700 text-gray-100';

  return (
    <form onSubmit={handleSubmit(handleClickSendInvite)}>
      <div className="flex flex-col gap-4 p-8 items-center justify-center">
        <input
          type="text"
          placeholder="Enter wallet address"
          defaultValue="0x508148d65644253acb0157ee87583107f7b803a3"
          required
          className={inputClassName}
          {...register('walletId')}
        />
        <input
          type="number"
          placeholder="Enter bet value"
          defaultValue="0.0001"
          required
          className={inputClassName}
          step="0.00001"
          {...register('bet')}
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
