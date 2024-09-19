import { useContext, useMemo, useState } from 'react';
import { UserContext } from 'app/providers/UserProvider';
import Web3 from 'web3';
import { Table } from 'flowbite-react';
import { diceContract } from 'blockchain/dice';

interface TransactionType {
  gameId: string;
  userA: string;
  userB: string;
  betAmount: string;
  createdAt: string;
}

export const SubscriptionEvents = () => {
  const [isSubscribed, setSubscribed] = useState(false);
  const [games, setGames] = useState<TransactionType[]>([
    {
      gameId: '9999999',
      userA: '0x508148d65644253acb0157ee87583107f7b803a3',
      userB: '0x508148d65644253acb0157ee87583107f7b803a3',
      betAmount: '0.00000001',
      createdAt: '1234124',
    },
    {
      gameId: '9999999',
      userA: '0x508148d65644253acb0157ee87583107f7b803a3',
      userB: '0x508148d65644253acb0157ee87583107f7b803a3',
      betAmount: '0.00000001',
      createdAt: '1234124',
    },
    {
      gameId: '9999999',
      userA: '0x508148d65644253acb0157ee87583107f7b803a3',
      userB: '0x508148d65644253acb0157ee87583107f7b803a3',
      betAmount: '0.00000001',
      createdAt: '1234124',
    },
  ]);
  const [subscriptionInstance, setSubscriptionInstance] = useState<any>(null);

  const [pendingGames, setPendingGames] = useState<string[] | null>(null);

  const user = useContext(UserContext);

  const contract = useMemo(() => {
    if (user?.web3) {
      return diceContract(user.web3);
    }
    return null;
  }, [user?.web3]);

  useMemo(() => {
    if (user?.web3) {
      const web3 = new Web3(
        new Web3.providers.WebsocketProvider(
          'wss://ethereum-sepolia-rpc.publicnode.com',
        ),
      );
      const contractInstance = diceContract(web3);

      const subscription = contractInstance.events.GameCreated();

      if (subscription && typeof subscription.on === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subscription.on('data', (event: any) => {
          console.log('event', event);

          const newGame = {
            gameId: event.returnValues.gameId?.toString(),
            userA: event.returnValues.userA?.toString(),
            userB: event.returnValues.userB?.toString(),
            betAmount: event.returnValues.betAmount?.toString(),
            createdAt: event.returnValues.createdAt?.toString(),
          };
          setGames((prev) => [newGame, ...prev]);

          console.log('New event received:', newGame);
        });

        subscription.on('error', (error: any) => {
          console.error('WebSocket connection closed:', error);
        });

        setSubscribed(true);
        setSubscriptionInstance(subscription);
      } else {
        console.error('Failed to create subscription.');
      }

      return null;
    }
  }, []);

  useMemo(() => {
    const fetchUserPendingGames = async () => {
      try {
        if (contract && user?.walletAddress) {
          const pendingGames = await contract.methods
            .getUserPendingGames()
            .call({
              from: user.walletAddress,
              // value: '0.0000001',
              gas: '300000',
            });
          setPendingGames(pendingGames as string[]);
          console.log('User Pending Games:', pendingGames);
        }
      } catch (error) {
        console.error('Error fetching user pending games:', error);
      }
    };

    fetchUserPendingGames();

    return () => {
      if (
        subscriptionInstance &&
        typeof subscriptionInstance.unsubscribe === 'function'
      ) {
        subscriptionInstance.unsubscribe();
      }
    };
  }, [contract, user?.walletAddress, subscriptionInstance]);

  const handleAcceptGame = async (game: string) => {
    const convertGame = String(game).replaceAll('n', '');
    console.log('game', convertGame);
    try {
      if (contract && user?.walletAddress) {
        const result = await contract.methods.acceptInvite(5).send({
          from: user.walletAddress,
          gas: '300000',
        });

        console.log('result', result);
      }
    } catch (error) {
      console.error('Error accept game:', error);
    }
  };

  return (
    <div className="text-gray-100 p-4 pb-20">
      <div className="flex flex-col gap-4">
        {pendingGames &&
          pendingGames.at(-1) &&
          pendingGames.map((game, index) => (
            <div key={index} className="flex gap-1">
              <button onClick={() => handleAcceptGame(game)}>Accept</button>
              <button>Reject</button>
            </div>
          ))}
      </div>
      <h1 className="text-2xl">Subscriptions</h1>
      {isSubscribed ? (
        <div className="">
          {games.at(-1) && (
            <Table className="">
              <Table.Head>
                <Table.HeadCell>gameId</Table.HeadCell>
                <Table.HeadCell>betAmount</Table.HeadCell>
                <Table.HeadCell>userA</Table.HeadCell>
                <Table.HeadCell>userB</Table.HeadCell>
                <Table.HeadCell>createdAt</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y p-4 m-4">
                {games.map((transaction, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="p-4 rounded indent-1">
                      <p className="indent-1">{transaction.gameId}</p>
                    </Table.Cell>
                    <Table.Cell className="p-4">
                      {transaction.betAmount}
                    </Table.Cell>
                    <Table.Cell className="p-4 indent-1">
                      <p className="indent-1">{transaction.userA}</p>
                    </Table.Cell>
                    <Table.Cell className="p-4 indent-1">
                      {transaction.userB}
                    </Table.Cell>
                    <Table.Cell className="p-4 indent-1">
                      {transaction.createdAt}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      ) : (
        <div>Not subscribed to events</div>
      )}

      {isSubscribed && !games.length && (
        <div className="mt-4">No transactions</div>
      )}
    </div>
  );
};
