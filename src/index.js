import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import SmartRaffleContract from '../build/contracts/SmartRaffle.json'
import { getWeb3 } from './utils'

import { default as reducer } from './reducers'
import Main from './components/main'
import Splash from './components/splash'

const store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

getWeb3.then(web3 => {
  const contract = require('truffle-contract')
  const SmartRaffle = contract(SmartRaffleContract)
  SmartRaffle.setProvider(web3.currentProvider)

  SmartRaffle.deployed().then((instance) => {
    let contract = new web3.eth.Contract(instance.abi, instance.address)

    web3.eth.getCoinbase().then((res) => {
      const rootElement = document.createElement('div')
      rootElement.setAttribute('id', 'smart-raffle')
      document.body.appendChild(rootElement)
      ReactDOM.render(
        <Provider store={store}>
          <Main
            contract={instance}
            web3={web3}
            coinbase={res}
            eventContract={contract}
          />
        </Provider>,
        rootElement
      )
    })
  }).catch((err) => {
    if(err =~ 'Error: Contract has not been deployed to detected network'){
      const rootElement = document.createElement('div')
      rootElement.setAttribute('id', 'smart-raffle')
      document.body.appendChild(rootElement)
      ReactDOM.render(
        <Splash networkMismatch={true} />,
        rootElement
      )
    }
  })
}).catch(() => {
  const rootElement = document.createElement('div')
  rootElement.setAttribute('id', 'smart-raffle')
  document.body.appendChild(rootElement)
  ReactDOM.render(
    <Splash />,
    rootElement
  )
})
