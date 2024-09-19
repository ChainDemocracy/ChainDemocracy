###

Send invite
Frontend => Frontend ???
args: smartContractId

Place bet
Frontend => SC
args: userAId, userBId, amount
return smartContractId

Get user all bets
Frontend => SC
args: userId

Accept bet
Frontend => SC
args: userBId, smartContractId
return: userAId, UserBId, smartContractId

...auto start game func

Send get money func to: userAId or userBId



let invite = {
    userAId,
    userBId,
    amount,
    userAStatus: status,
    userBStatus: status,
}

enum status {
    Paid,
    Rejected,
    Pending
}

get find by userId all user games: [invite, invite, ...]