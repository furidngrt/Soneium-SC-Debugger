import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const ETHERSCAN_API_KEY = "ebb6b7fd-850a-4329-8bad-2457c2e32dc3";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contractAddress, setContractAddress] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [abi, setAbi] = useState<any[]>([]);
  const [availableFunctions, setAvailableFunctions] = useState<any[]>([]);
  const [parameters, setParameters] = useState<any[]>([]);
  const [callData, setCallData] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Soneium Smart Contract Debugger";
  }, []);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("Metamask not installed!");
    }
  };

  const fetchAbiFromEtherscan = async () => {
    try {
      const response = await fetch(
        `https://soneium.blockscout.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "1" && data.result) {
        const parsedAbi = JSON.parse(data.result);
        setAbi(parsedAbi);
        const functions = parsedAbi
          .filter((item: any) => item.type === "function")
          .map((func: any) => func.name);
        setAvailableFunctions(functions);
        alert("ABI fetched successfully!");
      } else {
        alert("Failed to fetch ABI.");
      }
    } catch (error) {
      console.error("Error fetching ABI:", error);
    }
  };

  const generateCallData = async () => {
    try {
      if (!functionName) {
        alert("Please select a function first.");
        return;
      }

      const iface = new ethers.Interface(abi);
      const functionAbi = abi.find((item: any) => item.name === functionName);
      if (!functionAbi) {
        alert("Function not found in ABI.");
        return;
      }

      const formattedParams = functionAbi.inputs.map((input: any, index: number) =>
        input.type.includes("[]") ? parameters[index].split(",").map((val: string) => val.trim()) : parameters[index]
      );

      const encodedData = iface.encodeFunctionData(functionName, formattedParams);
      setCallData(encodedData);
      alert("Call data generated successfully!");
    } catch (error) {
      console.error("Error generating call data:", error);
    }
  };

  const estimateGas = async () => {
    if (!callData || !signer) {
      alert("Please generate call data first.");
      return;
    }

    try {
      const estimatedGas = await signer.estimateGas({
        to: contractAddress,
        data: callData
      });

      setGasEstimate(estimatedGas.toString());
      alert(`Estimated Gas: ${estimatedGas.toString()}`);
    } catch (error) {
      console.error("Gas estimation error:", error);
      alert("Gas estimation failed.");
    }
  };

  const sendTransaction = async () => {
    if (!callData || !signer) {
      alert("Please generate call data first.");
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: contractAddress,
        data: callData
      });

      alert(`Transaction sent! Hash: ${tx.hash}`);
      setTransactionHash(tx.hash);
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Soneium Smart Contract Debugger</h1>
        <button className="connect-btn" onClick={connectWallet}>
          {account ? `Connected: ${account.slice(0, 4)}..${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>

      <div className="box">
        <h4>Fetch Contract ABI</h4>
        <div className="input-group">
          <input
            type="text"
            className="input"
            placeholder="Enter Contract Address"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <div className="btn-container">
            <button className="btn success" onClick={fetchAbiFromEtherscan}>Fetch</button>
          </div>
        </div>
      </div>

      <div className="box">
        <h4>Select Function</h4>
        <select className="dropdown" onChange={(e) => setFunctionName(e.target.value)}>
          <option value="">Select a function</option>
          {availableFunctions.map((func, index) => (
            <option key={index} value={func}>{func}</option>
          ))}
        </select>
      </div>

      {functionName && (
        <div className="box">
          <h4>Enter Parameters</h4>
          {abi.find((func: any) => func.name === functionName)?.inputs.map((input: any, index: number) => (
            <div key={index} className="input-group">
              <label>{input.name} ({input.type})</label>
              <input
                type="text"
                className="input"
                placeholder={`Enter ${input.type}`}
                value={parameters[index]}
                onChange={(e) => {
                  const newParams = [...parameters];
                  newParams[index] = e.target.value;
                  setParameters(newParams);
                }}
              />
            </div>
          ))}
          <div className="btn-container">
            <button className="btn info" onClick={generateCallData}>Generate Call Data</button>
          </div>
        </div>
      )}

      <div className="box">
        <h4>Generated Call Data</h4>
        <textarea className="textarea" readOnly value={callData || "No call data generated yet"} />
      </div>

      <div className="box">
        <div className="btn-container">
          <button className="btn warning" onClick={estimateGas}>Estimate Gas</button>
        </div>
        {gasEstimate && <p className="success-message">Estimated Gas: {gasEstimate}</p>}
      </div>

      <div className="box">
        <div className="btn-container">
          <button className="btn danger" onClick={sendTransaction}>Send Transaction</button>
        </div>
        {transactionHash && <p className="success-message">Transaction Hash: {transactionHash}</p>}
      </div>
    </div>
  );
}

export default App;
