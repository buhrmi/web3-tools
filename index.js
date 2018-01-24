/*
  Promise-based tools to interact with the Ethereum network using web3.

  The following code has been written in the hope that it will be useful,
  but comes WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/

/**
 * @file web3-tools.js
 * @author Stefan Buhrmester <stefan@ai-innovation-japan.com>
 * @date 2017
 */

const Tx = require('ethereumjs-tx')

let web3
module.exports = function(_web3) {
  web3 = _web3
  return {sendTransaction, deployContract}
}

/**
 * Calls a contract on the Ethereum network. Returns a promise that resolves with the transaction receipt.
 * @param {object} options - An object describing the contract method that should be called.
 * @param {number} options.maxGas - When the estimated gas is higher than this, the transaction will not be sent and the promise rejected.
 * @param {string} options.methodName - The name of method to call
 * @param {string} options.contractAddress - The address of the contract
 * @param {string} options.contractABI - The ABI of the contract
 * @param {string} options.from - The address of the caller
 * @param {Buffer} options.fromKey - The private key of the caller
 * @param {Array} options.args - An array of arguments for the method call.
 * @returns {Promise<object>} - A promise that resolves to the ethereum transaction receipt
 */
const sendTransaction = function(options) {
  let txData;
  let {from, args = [], fromKey, contractAddress, contractABI, methodName, maxGas, contractSource, contractName} = options

  return new Promise(function(resolve, reject) {
    let abi = null;


    if (contractABI) {
      abi = typeof(contractABI) == 'string' ? JSON.parse(contractABI) : contractABI
    }
    // dont have contract json. compile from source.
    else if (contractSource && contractName) {
      let solc = require('solc')
      let contracts = solc.compile(contractSource).contracts
      let contract = contracts[':' + contractName]
      // ABI description as JSON structure
      abi = JSON.parse(contract.interface)
    }
    else return Promise.reject('Please provide either contractJSON or contractSource and contractName.')
    
    // Create Contract proxy class
    let contractProxy = new web3.eth.Contract(abi, contractAddress);
    txData = {
      from: from,
      to: contractAddress,
      data: contractProxy.methods[methodName](...args).encodeABI()
    }
    resolve(web3.eth.getGasPrice())
  })
  .then(function(price) {
    txData.gasPrice = price
    return web3.eth.getTransactionCount(from)
  }) 
  .then(function(count) {
    txData.nonce = count
    return web3.eth.estimateGas(txData)
  })
  .then(function(estimate) {
    if (estimate > maxGas) throw 'Estimated gas ' + estimate + ' higher than maxGas ' + maxGas
    txData.gasLimit = estimate
    let tx = new Tx(txData)
    tx.sign(fromKey)
    return web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(err, hash) {
      //if (hash) console.log('Sent transaction ' + hash + ' (' + methodName + ' with ' + txData.gasLimit + ' gasLimit) to network to mine.')
      if (hash) console.log(hash)
    })
  })
}

/**
 * Calls a contract on the Ethereum network. Returns a promise that resolves with the transaction receipt.
 * @param {object} options - An object describing the contract method that should be called.
 * @param {number} options.maxGas - Maximum amount of gas to spend on deployment. If estimate is higher, the promise will reject.
 * @param {string} options.contractJSON - The compiled JSON of the contract. Needs to have a field "abi" and "bytecode"
 * @param {string} options.from - The address of the caller (the creator).
 * @param {Buffer} options.fromKey - The private key of the caller
 * @param {Array} options.args - An array of arguments to pass to constructor.
 * @returns {Promise<object>} - A promise that resolves to the ethereum transaction receipt
 */
const deployContract = function(options) {
  let txData;
  let {from, args = [], fromKey, contractAddress, contractJSON, methodName, maxGas, contractSource, contractName} = options

  return new Promise(function(resolve, reject) {
    let abi, bytecode;


    if (contractJSON) {
      let contract = typeof(contractJSON) == 'string' ? JSON.parse(contractJSON) : contractJSON
      abi = JSON.parse(contract.abi)
      bytecode = contract.bytecode
    }
    // dont have contract json. compile from source.
    else if (contractSource && contractName) {
      let solc = require('solc')
      let contracts = solc.compile(contractSource).contracts
      let contract = contracts[':' + contractName]
      // ABI description as JSON structure
      abi = JSON.parse(contract.abi)
      bytecode = contract.bytecode
    }
    else return reject('Please provide either contractJSON or contractSource and contractName.')
    
    // Create Contract proxy class
    let contractProxy = new web3.eth.Contract(abi);
    // console.log(Object.keys(contractProxy))
    txData = {
      from: from,
      data: '0x' + contractProxy.deploy({data: bytecode, arguments: args}).encodeABI()
    }
    resolve(web3.eth.getGasPrice())
  })
  .then(function(price) {
    txData.gasPrice = price
    return web3.eth.getTransactionCount(from)
  }) 
  .then(function(count) {
    txData.nonce = count
    return web3.eth.estimateGas(txData)
  })
  .then(function(estimate) {
    if (estimate > maxGas) throw 'Estimated gas ' + estimate + ' higher than maxGas ' + maxGas
    txData.gasLimit = estimate
    let tx = new Tx(txData)
    tx.sign(fromKey)
    return web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'), function(err, hash) {
      if (hash) console.log('Sent deployment transaction ' + hash + ' (' + methodName + ' with ' + txData.gasLimit + ' gasLimit) to network to mine.')
    })
  })
}

