import React, { useState, useEffect } from 'react';
import './App.css';
import metamaskLogo from './metamask.png';
import phantomLogo from './phantom.avif';
import {PhantomProvider} from "@solana/web3.js";
import Web3 from 'web3';

function App() {

  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const updateAccountInfo = async () => {
      if (connected) {
        try {
          const web3 = new Web3(Web3.givenProvider);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          const balanceWei = await web3.eth.getBalance(accounts[0]);
          const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
          setBalance(balanceEth);
        } catch (err) {
          console.log(err);
        }
      }
    };
    updateAccountInfo();
  }, [connected]);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const sendTransaction = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      const tx = {
        from: account,
        to: recipient,
        value: web3.utils.toWei(amount, 'ether')
      };
      const result = await web3.eth.sendTransaction(tx);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Younified</h1>
      </header>
      <div className="App-body">
        <div className="App-card">
          <h2></h2>
          <p></p>
          {connected ? (
            <div>
              <p>Account: {account}</p>
              <p>Balance: {balance} MATIC</p>
              <label>
                
                <input type="text" placeholder='Wallet Address' value={recipient} onChange={(e) => setRecipient(e.target.value)} />
              </label>
              <br />
              <label>
                
                <input type="text" placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
              </label>
              <br />
              <button onClick={sendTransaction}>Send</button>
            </div>
          ) : (
            <div className="App-buttons">
              <button className="App-button metamask" onClick={connectWallet}>
                <img src={metamaskLogo} alt="Metamask" />
                Connect Metamask
              </button>
              <button className="App-button phantom" onClick={connectWallet}>
                <img src={phantomLogo} alt="Phantom" />
                Connect Phantom
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="App-footer">
        <p>Copyright © 2023</p>
      </footer>
    </div>
  );
}

export default App;
