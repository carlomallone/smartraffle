# SmartRaffle
Raffle runs on the Ethereum blockchain. Users interact with the smart contract through MetaMask.

Players can place a bet between minimum and maximum allowed amounts. Each amount wagered grants a given number of raffle tickets (plus bonus tickets to give early punters incentive to join).

Every time the deployed contract jackpot is hit (e.g. 10 ETH) one winning ticket is drawn and the prize sent (minus a small house cut), then another raffle starts.

Jackpot, minimum and maximum bets are set by deploying the contract with desired parameters. 

The house cut can be adjusted live by the owner. The owner can also stop/resume the game, and refund all players.

RNG is solved by using Oraclize API. Anyway, the cost of any brute force approach would be way higher then the 10 ETH payout.

## Tech
* Webpack
* React
* Redux
* Thunk
* Web3(MetaMask)
* Smart contract/Solidity
* Truffle
* Jest

### Gas Performance

* Smart contract gas usage is critical, and higher fees are detrimental for players, expecially when betting lower amounts. 
In order to avoid loops when possible, the contract uses mapping and custom structs to create a binary tree for recording raffle tickets. 
This gives us the chance of finding the winner in log2N steps (e.g. ~12 steps for ~2000 tickets sold) instead of thousands.

* Another optimization is done by calculating and setting the lowest possible amount of gas for each transaction, given that the last one (the one that actually draws the ticket and send prize) is more expensive.


### TO-DO

* Use Sagas
* Move more logic outside of React components to Sagas
* Test reducers
* Write even more tests for the smart contract
* Deploy on the Ethereum test network
