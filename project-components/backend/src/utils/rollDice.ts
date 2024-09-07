export function rollDice() {
  let user1, user2;

  do {
    user1 = Math.floor(Math.random() * 11) + 2;
    user2 = Math.floor(Math.random() * 11) + 2;
  } while (user1 === user2);

  return { user1, user2 };
}
