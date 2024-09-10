import { useContext, useEffect, useState } from 'react';
import { InviteForm } from '../components/InviteForm/InviteForm';
import { UserContext } from '../app/providers/UserProvider';
import { WebSocketContext } from '../app/providers/SocketProvider';
import { ContractInfo } from 'components/contractInfo/contractInfo';

type Invite = { from: string; to: string; bet: string };

export enum InviteStatus {
  SENT = 'sent',
  REJECTED = 'rejected',
  OFFLINE = 'offline',
}

export const MainPage = () => {
  const socketContext = useContext(WebSocketContext);
  const user = useContext(UserContext);

  const [invites, setInvites] = useState<Array<Invite>>([]);
  const [inviteStatus, setInviteStatus] = useState<InviteStatus | null>(null);

  const [diceResult, setResult] = useState<
    Array<{
      from: string;
      to: string;
      bet: string;
      diceTo: number;
      diceFrom: number;
    }>
  >([]);

  const { socket } = socketContext || {};
  const { walletAddress, connectWallet } = user || {};

  const hasWallet = walletAddress && walletAddress.length > 0;

  const handleAcceptInvite = (invite: Invite) => {
    if (!socket || invites.length < 1) return;

    socket.emit('accepted_invite', {
      to: walletAddress,
      from: invite.from,
      bet: invite.bet,
    });
    setInvites([]);
  };

  const handleRemoveInvite = (invite: Invite) => {
    if (!socket || invites.length < 1) return;

    socket.emit('reject_invite', {
      to: invite.from,
      from: walletAddress,
      bet: invite.bet,
    });
    setInvites([]);
    setInviteStatus(null);
  };

  useEffect(() => {
    if (!socket) {
      console.log('Socket.io is not connected');
      return;
    }

    const handleInvite = (data: { from: string; to: string; bet: string }) => {
      console.log('Invite received:', data);

      if (data.to !== walletAddress) return;

      setInvites([{ from: data.from, to: data.to, bet: data.bet }]);
    };

    const handleResult = (data: {
      from: string;
      to: string;
      bet: string;
      diceTo: number;
      diceFrom: number;
    }) => {
      console.log('Result received:', data);

      setInvites([]);
      setInviteStatus(null);

      setResult([
        {
          from: data.from,
          to: data.to,
          bet: data.bet,
          diceTo: data.diceTo,
          diceFrom: data.diceFrom,
        },
      ]);
    };

    const handleOfflineUser = () => {
      setInviteStatus(InviteStatus.OFFLINE);
    };

    const handleRejectInvite = () => {
      setInviteStatus(InviteStatus.REJECTED);
    };

    socket.on('invite_sent', handleInvite);
    socket.on('send_result', handleResult);
    socket.on('invited_user_offline', handleOfflineUser);
    socket.on('send_reject', handleRejectInvite);

    return () => {
      socket.off('invite_sent', handleInvite);
      socket.off('send_result', handleResult);
      socket.off('invited_user_offline', handleOfflineUser);
      socket.off('send_reject', handleRejectInvite);
    };
  }, [socket, walletAddress]);

  if (!user || !socketContext) return null;

  return (
    <>
      <div className="flex flex-col gap-4 text-white p-4 text-md">
        <div className="w-[400px] flex flex-col gap-4 justify-center items-center">
          <button
            className="w-48  bg-green-400 rounded-full px-4 py-2"
            onClick={() => {
              setInviteStatus(null);
              setResult([]);
            }}
          >
            Reset
          </button>
          {inviteStatus === InviteStatus.OFFLINE && <>User offline</>}
          {inviteStatus === InviteStatus.REJECTED && (
            <>User rejected your invite</>
          )}
          {inviteStatus === InviteStatus.SENT && <>Invite sended</>}
        </div>
      </div>
      {diceResult.length > 0 && (
        <div className="flex flex-col gap-4 text-white p-4 w-96">
          {diceResult.map((invite, index) => (
            <div key={index} className="flex flex-col gap-4">
              <p>from: {invite.from}</p> <p>to: {invite.to}</p>{' '}
              <p>bet: {invite.bet}</p>
              <p>diceFrom: {invite.diceFrom}</p>
              <p>diceTo: {invite.diceTo}</p>
            </div>
          ))}
        </div>
      )}
      {invites.length > 0 && (
        <div className="text-white">
          <h2>Invites</h2>
          <ul>
            {invites.map((invite, index) => (
              <li key={index} className="flex flex-col gap-4">
                <span>
                  From: {invite.from} - Bet: {invite.bet}
                </span>
                <div className="flex gap-4 items-center justify-center">
                  <button
                    onClick={() => handleAcceptInvite(invite)}
                    className="bg-green-600 hover:bg-green-700 p-2 px-4 rounded-full"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRemoveInvite(invite)}
                    className="bg-red-600 hover:bg-red-700 p-2 px-4 rounded-full"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasWallet ? (
        <p className="text-gray-100">
          Your wallet:
          <br /> {walletAddress}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-700 rounded-xl text-white flex items-center justify-center text-center px-8 py-4 hover:bg-purple-800 text-3xl"
        >
          Connect wallet
        </button>
      )}
      {hasWallet && (
        <InviteForm
          walletOwnerAddress={walletAddress}
          setInviteStatus={setInviteStatus}
        />
      )}

      {hasWallet && <ContractInfo />}
    </>
  );
};
