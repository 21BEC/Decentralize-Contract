import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import smart_Contract from "./smart_contract.json";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [smart_Contract, setSmartContract] = useState(null);
  
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Requesting accounts
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  async function loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const contract = new web3.eth.Contract(smart_Contract.abi, contractAddress);
    setSmartContract(contract);

    const balance = await contract.methods.getBalance().call({ from: accounts[0] });
    setBalance(web3.utils.fromWei(balance, "ether"));
  }
  async function handleDeposit() {
    if (smart_Contract) {
      const web3 = window.web3;
      const amountInWei = web3.utils.toWei(amount, "ether");

      await smart_Contract.methods
        .deposit()
        .send({ from: account, value: amountInWei });

      const balance = await smart_Contract.methods.getBalance().call({ from: account });
      setBalance(web3.utils.fromWei(balance, "ether"));

      setAmount("");
    }
  }
  async function handleWithdraw() {
    if (smart_Contract) {
      const web3 = window.web3;
      const amountInWei = web3.utils.toWei(amount, "ether");

      await smart_Contract.methods
        .withdraw(amountInWei)
        .send({ from: account });

      const balance = await smart_Contract.methods.getBalance().call({ from: account });
      setBalance(web3.utils.fromWei(balance, "ether"));

      setAmount("");
    }
  }
  return (
    <div className="App">
      <h1>SMART_CONTRACT</h1>
      <p>ACCOUNT: {account} address</p>
      <p>STORED:  {balance} ETH</p>
      <div>
        <h3>Saving</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>
      <div>
        <h3>Withdrawing</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}
export default App;
