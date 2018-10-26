import React from 'react'
import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var web3 = window.web3

    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
      resolve(web3)
    } else {
      reject(false)
    }
  })
})
export { getWeb3 }

let readableAddress = (props, address) => {
  const { coinbase, contract } = props

  if(!address) {
    return 'N/A'
  }

  if(!props){
    return address
  }

  if(address.toLowerCase() === contract.address.toLowerCase()){
    return address + ' (SmartRaffle)'
  }

  if(address.toLowerCase() === coinbase.toLowerCase()){
    return address + ' (You)'
  }

  return address
}
export { readableAddress }

let toEth = (amount) => {
  return amount/10000
}
export { toEth }

let toEthString = (amount) => {
  return `${toEth(amount)} ETH`
}
export { toEthString }

let contractCallMethods = (el) => {
  if(el === 'totalTickets'){
    return 'getTickets'
  }

  if(el === 'playerBet'){
    return 'getPlayerBet'
  }

  if(el === 'playerTickets'){
    return 'getPlayerTickets'
  }

  if(el === 'owner'){
    return 'getOwner'
  }

  return el
}
export { contractCallMethods }

let truncateAddress = (address) => {
  if(!address)
    return ''
  return address.replace(/^(.{5}).*(.{5})$/, '$1....$2')
}
export { truncateAddress }

let ethScanLink = (hash, label) => {
  let myLabel = label ? label : <i className="fas fa-external-link-alt"></i>

  return  <a
            href={`https://ropsten.etherscan.io/tx/${hash}`}
            target="_blank"
          >
            {myLabel}
          </a>
}
export { ethScanLink }

let ethScanUserLink = (hash, label) => {
  let myLabel = label ? label : <i className="fas fa-external-link-alt"></i>

  return  <a
            href={`https://ropsten.etherscan.io/address/${hash}#internaltx`}
            target="_blank"
          >
            {myLabel}
          </a>
}
export { ethScanUserLink }
