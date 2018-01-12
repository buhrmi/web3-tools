# web3-tools

A collection of tools to interact with the Ethereum blockchain through a web3 instance.

## Installation

### Node.js

    npm install --save web3-tools

### Browser

Browser package is currently not available. Stay tuned. For now, you can use browserify.

## Usage

The library is initialized with a web3 instance. It exports an object with uncomplicated, easy to use functions.

```js
const web3 = someWeb3Instance
const {deployContract, sendTransaction} = require('web3-tools')(web3)
```

All functions of the library return a promise that resolves to a transaction receipt as soon as the contract is mined. A transaction receipt (for example for contract deployment) looks like this:

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

A promise that resolves to the transaction receipt when the transaction is mined.

#### Example

```js
let options = {
    maxGas: 3000000,
    contractJSON: fs.readFileSync("./mycontract.json").toString(),
    from: '0x11b1EeC366d1e79923c15514f1B8C014Ce780c8D',
    fromKey: Buffer.from('f8ce489f073b6aa62b8841894e42b0fac0b522185dc350af0a4f2ce3b43633a9', 'hex'),
    args: []
}

deployContract(options)
.then(function(receipt) {
  console.log('Contract deployed at ' + receipt.contractAddress)
})
.catch(console.error)
```

### `sendTransaction`

Call a method of a deployed contract. Will send a transaction to the network.

#### Parameters

  1. `options`
     - `options.methodName`: The name of the method to be called
     - `options.contractAddress`: The address of the contract
     - `options.contractJSON`: The compiled JSON of the contract
     - `options.from`: The caller address. Use your public ethereum address here.
     - `options.fromKey`: The private key belonging to the caller.
     - `options.args`: Array of arguments to be passed to the method. 
     - `options.maxGas`: The maximum amount of gas to pay. Promise will reject if too low.

#### Returns

A promise that resolves to the transaction receipt when the transaction is mined.

#### Example

```js
let options = {
    maxGas: 10000,
    methodName: 'sendTokens',
    contractAddress: '0x6dc1733d8c009e908274c055e2656ad3f45a860f',
    contractJSON: fs.readFileSync("./mycontract.json").toString(),
    from: '0x11b1EeC366d1e79923c15514f1B8C014Ce780c8D',
    fromKey: Buffer.from('f8ce489f073b6aa62b8841894e42b0fac0b522185dc350af0a4f2ce3b43633a9', 'hex'),
    args: ['0x11b1EeC366d1e79923c15514f1B8C014Ce780c8D', 100]
}

sendTransaction(options)
.then(function(receipt) {
  console.log('Done')
})
.catch(console.error)
```


## Contributing

We could use some tests. Pull requests are welcome.