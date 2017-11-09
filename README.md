# web3-tools

A collection of tools to interact with the Ethereum blockchain through a web3 instance.

## Installation

### Node.js

    npm install --save web3-tools

### Browser

Browser package is currently not available. Stay tuned. For now, you can use browserify.

## Usage

The library is initialized with a web3 instance. It exports an object with easy to use functions to simplify your life.

```js
const web3 = someWeb3Instance
const {deployContract, callContract} = require('web3-tools')(web3)
```

All functions return a promise that resolve to a transaction receipt. A transaction receipt (for example for contract deployment) looks like this:

```js
{ blockHash: '0x2e16f86b70d4c8f89f442295584017590b7b3ac0d27847b0e04df64bd5aa7a89',
  blockNumber: 4652060,
  contractAddress: '0x86Af6004557039b52666b0B58eb052E6Ddeeb1Af',
  cumulativeGasUsed: 1649769,
  gasUsed: 1649769,
  logs: [],
  logsBloom: '0x00000....',
  root: null,
  status: null,
  transactionHash: '0xb9de15fc9197d0501873445674b253aa0469e8e50d090609b80082bc503733d7',
  transactionIndex: 0 }
```

### `deployContract`

Deploy a contract on the blockchain.

#### Parameters

  1. `options`
     - `options.contractJSON`: The compiled JSON of the contract
     - `options.from`: The contract creator address. Use your public ethereum address here.
     - `options.fromKey`: The private key belonging to the creator.
     - `options.args`: Arguments passed to the constructor. 
     - `options.maxGas`: The maximum amount of gas to pay. Promise will reject if too low.

#### Returns

A promise that resolves to the transaction receipt.

#### Example

```js
deployContract(options)
.then(function(receipt) {
  console.log('Contract deployed at ' + receipt.contractAddress)
})
.catch(console.error)
```

### callContract



## Contributing

We could use some tests. Pull requests are welcome.