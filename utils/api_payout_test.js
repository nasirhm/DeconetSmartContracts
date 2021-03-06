let Web3 = require('web3')
let BigNumber = require('bignumber.js')
let uuid = require('uuid')

let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))


let relayJson = require('../build/contracts/Relay.json')
let apiCallsJson = require('../build/contracts/APICalls.json')
let tokenJson = require('../build/contracts/DeconetToken.json')

let apiId = 3

// send from here. key for acct index 0 in ganache
let ownerAddress = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'
let privKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
web3.eth.accounts.privateKeyToAccount(privKey)

// token so that we can make sure it's unpaused
let tokenContractAddress = '0x6e4d800d3ce2a259a31653a9d89d36ecd274e3a4'
let tokenContract = new web3.eth.Contract(tokenJson.abi, tokenContractAddress)

// relay contract address
let relayContractAddress = '0x964839283df5966a929dad39c5ce5cdcaaf332e0'
let relayContract = new web3.eth.Contract(relayJson.abi, relayContractAddress)

tokenContract.methods.paused()
.call()
.then(function (paused) {
  console.log('token is paused: ' + paused)
  if (paused) {
    return tokenContract.methods.unpause().send({from: ownerAddress})
    .then(function () {
      // get api calls contract address
      return relayContract.methods.apiCallsContractAddress().call()
    })
  }
  // get api calls contract address
  return relayContract.methods.apiCallsContractAddress().call()
})
.then(function (address) {
  let apiCallsContract = new web3.eth.Contract(apiCallsJson.abi, address)
  return apiCallsContract.methods.paySeller(apiId).send({from: ownerAddress, gasLimit: '4000000'})
})
.then(function (response) {
  console.log(response)
})
