import { useContext, useEffect, useState } from 'react';
import { InviteForm } from '../components/InviteForm/InviteForm';
import { UserContext } from '../app/providers/UserProvider';
import { WebSocketContext } from '../app/providers/WebSocketProvider';
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
  const wsContext = useContext(WebSocketContext);
  const user = useContext(UserContext);

  const [invites, setInvites] = useState<Array<{ from: string; bet: string }>>(
    [],
  );

  const { ws } = wsContext || {};
  const { walletAddress, connectWallet } = user || {};

  const hasWallet = walletAddress && walletAddress.length > 0;

  const handleAcceptInvite = () => {};

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === 'invite') {
        setInvites((prevInvites) => [
          ...prevInvites,
          { from: data.from, bet: data.bet },
        ]);
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws]);

  if (!user || !wsContext) return null;

  console.log('invites', invites);

  return (
    <>
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
                    onClick={handleAcceptInvite}
                    className="bg-green-600 hover:bg-green-700 p-2 px-4 rounded-full"
                  >
                    Accept
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 p-2 px-4 rounded-full">
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasWallet ? (
        <p className="text-gray-100">{walletAddress}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-700 rounded-xl text-white flex items-center justify-center text-center px-8 py-4 hover:bg-purple-800 text-3xl"
        >
          Connect wallet
        </button>
      )}
      {hasWallet && <InviteForm walletAddress={walletAddress} />}
    </>
  );
};
