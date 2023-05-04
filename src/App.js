import React, { useState } from 'react';
import './CryptoWallet.css';
import { FaEthereum } from 'react-icons/fa';
import {TbCurrencySolana} from 'react-icons/tb';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { BsArrowDown } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoMdBatteryCharging } from 'react-icons/io';
import { MdCallReceived } from 'react-icons/md';
import { AiOutlineSend } from 'react-icons/ai';
import Web3 from 'web3';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { FaArrowCircleUp, FaArrowCircleDown } from 'react-icons/fa';


function App() {

  const [web3, setWeb3] = useState(null);
  const [connection, setConnection] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [showPreferredCoin, setShowPreferredCoin] = useState(false);

  const [preferredCoin, setPreferredCoin] = useState('MATIC')

  const [selectedAccount, setSelectedAccount] = useState('0x1234567890abcdef1234567890abcdef12345678');
  const [showNetworkOptions, setShowNetworkOptions] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('Mainnet');

  const [solAmount, setSolAmount] = useState(0);
  const [maticAmount, setMaticAmount] = useState(0);

  async function convertSolToMatic() {
    try {
      // Get the current USD price of Solana
      const solResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
      );
      const solData = await solResponse.json();
      const solPrice = solData.market_data.current_price.usd;
  
      // Get the current USD price of Matic
      const maticResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/matic-network?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
      );
      const maticData = await maticResponse.json();
      const maticPrice = maticData.market_data.current_price.usd;
  
      // Convert Solana to USD
      const usdValue = solAmount * solPrice;
  
      // Convert USD to Matic
      const maticConversion = usdValue / maticAmount;
  
      setMaticAmount(maticConversion.toFixed(4));
    } catch (error) {
      console.error(error);
    }
  }

  async function convertMaticToSol() {
    try {
      // Get the current USD price of Matic
      const maticResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/matic-network?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
      );
      const maticData = await maticResponse.json();
      const maticPrice = maticData.market_data.current_price.usd;

      // Get the current USD price of Solana
      const solResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/solana?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
      );
      const solData = await solResponse.json();
      const solPrice = solData.market_data.current_price.usd;

      // Convert Matic to USD
      const usdValue = maticAmount * maticPrice;

      // Convert USD to Solana
      const solConversion = usdValue / solAmount;

      setSolAmount(solConversion.toFixed(4));
    } catch (error) {
      console.error(error);
    }
  }

  const deposit = () => {
    setBalance(balance + Number(transactionAmount));
    setTransactionAmount(0);
  };

  const connectMetamask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new Web3(window.ethereum);
        setWeb3(provider);
        const accounts = await provider.eth.getAccounts();
        setConnectedAddress(accounts[0]);
      } else {
        alert('Please install Metamask to use this feature.');
      }
    } catch (err) {
      alert(err);
    }
  };

  const connectPhantom = async () => {
    try {
      if (window.solana) {
        const provider = window.solana;
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        setConnection(connection);
        const publicKey = await provider.publicKey();
        setConnectedAddress(publicKey.toString());
      } else {
        alert('Please install Phantom wallet to use this feature.');
      }
    } catch (err) {
      alert(err);
    }
  };



  const withdraw = () => {
    if (balance >= transactionAmount) {
      setBalance(balance - Number(transactionAmount));
      setTransactionAmount(0);
    } else {
      alert('Insufficient balance');
    }
  };

  const toggleAccountOptions = () => {
    setShowAccountOptions(!showAccountOptions);
  };
  const togglePrefferredCoin = () => {
    setShowPreferredCoin(!showPreferredCoin);
  };

  const selectAccount = (account) => {
    setSelectedAccount(account);
    setShowAccountOptions(false);
  };

  const toggleNetworkOptions = () => {
    setShowNetworkOptions(!showNetworkOptions);
  };

  const selectNetwork = (network) => {
    setSelectedNetwork(network);
    setShowNetworkOptions(false);
  };

  const SendButton = () => {
    return (
      <button className="send-button">
        <FaArrowCircleUp className="send-icon" />
        <span>Send</span>
      </button>
    );
  };
  
  const ReceiveButton = () => {
    return (
      <button className="receive-button">
        <FaArrowCircleDown className="receive-icon" />
        <span>Receive</span>
      </button>
    );
  };
  

  return (

    <div className="card-container">
    <div className="card">
      <div className="card-header">
      <div className="crypto-wallet-logo">
          <FaEthereum size={30} />

          <TbCurrencySolana size={30} />
          
          <h1></h1>
        </div>
       
        <div className="crypto-wallet-balance">
          <h2 className="balance">{Number(balance).toFixed(4)} MATIC</h2>
          <MdAccountBalanceWallet size={30} />
        </div>
      </div>
      <div className="card-body">
        
      <center>
      <button 
          onClick={connectMetamask} 
          style={{ 
            background: '#F6851B', 
            color: 'white', 
            borderRadius: '4px', 
            padding: '10px', 
            border: 'none', 
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Connect with Metamask
        </button>
        <button 
          onClick={connectPhantom} 
          style={{ 
            background: '#3C3C3D', 
            color: 'white', 
            borderRadius: '4px', 
            padding: '10px', 
            border: 'none', 
            cursor: 'pointer'
          }}
        >
          Connect with Phantom
        </button>
        </center>

        
      <div className="crypto-wallet-account">

        {/* <div className="crypto-wallet-account-selector" onClick={toggleAccountOptions}>
          <FiUser size={24} />
          <p>{selectedAccount.substr(0, 6)}...{selectedAccount.substr(-4)}</p>
          {showAccountOptions ? <IoMdArrowDropup size={24} /> : <IoMdArrowDropdown size={24} />}
        </div> */}
        {/* {showAccountOptions &&
          <div className="crypto-wallet-account-options">
            <div className="crypto-wallet-account-option" onClick={() => selectAccount('0x1234567890abcdef1234567890abcdef12345678')}>
              <FiUser size={24} />
              <p>0x1234567890abcdef1234567890abcdef12345678</p>
            </div>
            <div className="crypto-wallet-account-option" onClick={() => selectAccount('0xabcdef1234567890abcdef1234567890abcdef12')}>
              <FiUser size={24} />
              <p>0xabcdef1234567890abcdef1234567890abcdef12</p>
            </div>
          </div>
        } */}
      </div>

      <div className="crypto-wallet-transaction">
      <div className="crypto-wallet-transaction-input">
      <input type="number" placeholder="0.00" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} />
     
    </div>
    
    

    {/* <div className="crypto-wallet-transaction-buttons">
        <button onClick={deposit}><MdCallReceived size={24} /></button>
        <button onClick={withdraw}><AiOutlineSend size={24} /></button>
      </div> */}
    {/* <div className="crypto-wallet-network-selector" onClick={toggleNetworkOptions}>
      <p>{selectedNetwork}</p>
      {showNetworkOptions ? <IoMdArrowDropup size={24} /> : <IoMdArrowDropdown size={24} />}
    </div> */}

    <div className="crypto-wallet-network-selector" onClick={togglePrefferredCoin}>
      <p>{preferredCoin}</p>
      {showPreferredCoin ? <IoMdArrowDropup size={24} /> : <IoMdArrowDropdown size={24} />}
    </div>

   

    {showNetworkOptions &&
      <div className="crypto-wallet-network-options">
        <div className="crypto-wallet-network-option" onClick={() => selectNetwork('Mainnet')}>
          <p>Mainnet</p>
        </div>
        <div className="crypto-wallet-network-option" onClick={() => selectNetwork('Testnet')}>
          <p>Testnet</p>
        </div>
      </div>
    }

    {showPreferredCoin &&
      <div className="crypto-wallet-network-options">
        <div className="crypto-wallet-network-option" onClick={() => setPreferredCoin('MATIC')}>
          <p>MATIC</p>
        </div>
        <div className="crypto-wallet-network-option" onClick={() => setPreferredCoin('SOL')}>
          <p>SOL</p>
        </div>
        
      </div>
    }
  </div>
  <div className="crypto-wallet-transaction-input">
     <input type="text" placeholder="Enter Wallet Address" onChange={(e) => setTransactionAmount(e.target.value)} />
     
    </div>
    <br/>
  <div className="buttons-container">
      <SendButton />
      <ReceiveButton />
    </div>

      </div>
    </div>
  </div>

  
);
}

export default App;


       
// 1. Enter wallet address
// 2. Detect chain
// 3. Check the price
// 4. Send request to API
// 5. Deposit into wallet address

// 6. Check if preference is same, then don't change or convert

// Connect Price API
// Calculate price in Solana to MATIC

// Send funds to phantom from metamask
// 

// Development
// 1. Connect Metamask/Phantom Wallet
