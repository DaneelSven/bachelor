import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux'
import {loadWeb3, loadAccount, loadToken, loadExchange} from '../store/interactions'
import Navbar from './Navbar';
import Content from './content';
import {contractsLoadedSelector} from '../store/selectors';

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    const web3 = loadWeb3(dispatch)
    // const web31 = new Web3(new Web3.providers.HttpProvider(`http://127.0.0.1:7545`))
    await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)
    const token = await loadToken(web3, networkId, dispatch)
    if(!token){
      window.alert('Token smart contract not detected on the curernt network. Please selecent another network with metamask')
      return
    }
    const exchange = await loadExchange(web3, networkId, dispatch)
    if(!exchange){
      window.alert('Exchange smart contract not detected on the curernt network. Please selecent another network with metamask')
      return
    }
    // const totalSupply = await token.methods.totalSupply().call()
  }

  render() {
    return (
      <div>
        <Navbar/>
        {this.props.contractsLoaded ? <Content/> : <div className="content"></div>}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App);
