import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

// Updated ABI to include flipCoin function
const coinFlipTokenAbi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "inputs": [],
    "name": "flipCoin",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [api, setApi] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({});
  const [account, setAccount] = useState(null);
  const [flipResult, setFlipResult] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await web3Enable('CoinFlip Token Game');
        const accounts = await web3Accounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }

        const wsProvider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');
        const api = await ApiPromise.create({ provider: wsProvider });
        setApi(api);

        const contractAddress = '0x37822de108AFFdd5cDCFDaAa2E32756Da284DB85'; // Replace with your actual contract address
        const contract = new ContractPromise(api, coinFlipTokenAbi, contractAddress);
        setContract(contract);

        // Fetch token info
        const { output: name } = await contract.query.name();
        const { output: symbol } = await contract.query.symbol();
        const { output: decimals } = await contract.query.decimals();

        setTokenInfo({
          name: name.toString(),
          symbol: symbol.toString(),
          decimals: decimals.toNumber()
        });
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    init();
  }, []);

  const getBalance = async () => {
    if (contract && account) {
      try {
        const { output: balance } = await contract.query.balanceOf(account.address);
        console.log(`Balance: ${balance.toString()}`);
      } catch (error) {
        console.error('Error getting balance:', error);
      }
    }
  };

  const flipCoin = async () => {
    if (contract && account) {
      try {
        const injector = await web3FromSource(account.meta.source);
        const { gasRequired, result } = await contract.query.flipCoin(account.address, { value: 0, gasLimit: -1 });

        if (result.isOk) {
          const tx = await contract.tx.flipCoin({ value: 0, gasLimit: gasRequired });
          const unsub = await tx.signAndSend(account.address, { signer: injector.signer }, (result) => {
            if (result.status.isInBlock || result.status.isFinalized) {
              const events = result.events.filter(({ event }) =>
                  event.method === 'CoinFlipped'
              );
              if (events.length > 0) {
                const [{ event: { data: [, isHeads] } }] = events;
                setFlipResult(isHeads.isTrue ? 'Heads' : 'Tails');
              }
              unsub();
            }
          });
        } else {
          console.error('Error flipping coin:', result.asErr);
        }
      } catch (error) {
        console.error('Error flipping coin:', error);
      }
    }
  };

  return (
      <div>
        <h1>CoinFlip Token Game</h1>
        <p>Name: {tokenInfo.name}</p>
        <p>Symbol: {tokenInfo.symbol}</p>
        <p>Decimals: {tokenInfo.decimals}</p>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={flipCoin}>Flip Coin</button>
        {flipResult && <p>Flip Result: {flipResult}</p>}
      </div>
  );
}

export default App;

