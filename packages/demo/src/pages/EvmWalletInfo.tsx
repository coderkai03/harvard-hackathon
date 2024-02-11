// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Some code of this file refer to https://github.com/MetaMask/test-dapp/blob/main/src/index.js
import { keccak256 } from '@ethersproject/keccak256';
import { Maybe } from '@metamask/providers/dist/utils';
import { METHOD_MAP } from "./methods";
import { Button, Input, message, Select } from 'antd';
import type  { WalletState }  from '@subwallet_connect/core'
// eslint-disable-next-line camelcase
import { recoverPersonalSignature, recoverTypedSignature, recoverTypedSignature_v4, recoverTypedSignatureLegacy, TypedData, TypedMessage } from 'eth-sig-util';
import React, { useCallback, useEffect, useState } from 'react';
import { EIP1193Provider } from '@subwallet_connect/common'
import { useConnectWallet, useSetChain } from "@subwallet_connect/react";
import {useNavigate} from "react-router-dom";
import {HeaderWalletInfo} from "../components/header/HeaderWalletInfo";
import { ThemeProps } from '../types';
import CN from "classnames";
import styled from "styled-components";
import AccountList from "../components/AccountList";
import WalletMetadata from "../components/WalletMetadata";





const { Option } = Select;

// Json file is download from https://chainid.network/chains.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const chainList = require('./evmChains.json') as NetworkInfo[];
// const chain81Index = chainList.findIndex((n) => n.chainId === 81);
//
//
//
//
// if (chain81Index) {
//   chainList[chain81Index] = {
//     name: 'Shibuya Testnet',
//     chain: 'Shibuya',
//     rpc: ['wss://rpc.shibuya.astar.network'],
//     faucets: [],
//     nativeCurrency: { name: 'Shibuya', symbol: 'SBY', decimals: 18 },
//     infoURL: 'https://shibuya.astar.network/',
//     chainId: 81,
//     networkId: 81,
//     shortName: 'SBY',
//     explorers: [{ name: 'subscan', url: 'https://shibuya.subscan.io', standard: 'none' }]
//   };
// }
//
// interface NetworkInfo {
//   name: string,
//   chain: string,
//   rpc: string[],
//   faucets: string[],
//   nativeCurrency: { name: string, 'symbol': string, 'decimals': number },
//   infoURL: string,
//   shortName: string,
//   chainId: number,
//   networkId: number,
//   explorers: [{ 'name': string, 'url': string, 'standard': string }]
// }
//
// const SIGN_METHODS = {
//   ethSign: {
//     name: 'ETH Sign',
//     method: 'eth_sign',
//     getInput: (message: string): string => {
//       return keccak256(Buffer.from(message, 'utf8'));
//     }
//   },
//   personalSign: {
//     name: 'Personal Sync',
//     method: 'personal_sign',
//     getInput: (message: string): string => {
//       return `0x${Buffer.from(message, 'utf8').toString('hex')}`;
//     }
//   },
//   signTypedData: {
//     name: 'Sign Typed Data',
//     method: 'eth_signTypedData',
//     getInput: (message: string): TypedData => {
//       return [{
//         type: 'string',
//         name: 'Message',
//         value: message
//       }];
//     }
//   },
//   signTypedDatav3: {
//     name: 'Sign Typed Data v3',
//     method: 'eth_signTypedData_v3',
//     getInput: (message: string, chainId: number, from: string): TypedMessage<any> => {
//       return {
//         types: {
//           EIP712Domain: [
//             { name: 'name', type: 'string' },
//             { name: 'version', type: 'string' },
//             { name: 'chainId', type: 'uint256' },
//             { name: 'verifyingContract', type: 'address' }
//           ],
//           Person: [
//             { name: 'name', type: 'string' },
//             { name: 'wallet', type: 'address' }
//           ],
//           Mail: [
//             { name: 'from', type: 'Person' },
//             { name: 'to', type: 'Person' },
//             { name: 'contents', type: 'string' }
//           ]
//         },
//         primaryType: 'Mail',
//         domain: {
//           name: 'Ether Mail',
//           version: '1',
//           chainId,
//           verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
//         },
//         message: {
//           from: {
//             name: 'John Doe',
//             wallet: from
//           },
//           to: {
//             name: 'Alice',
//             wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
//           },
//           contents: message
//         }
//       };
//     }
//   },
//   signTypedDatav4: {
//     name: 'Sign Typed Data v4',
//     method: 'eth_signTypedData_v4',
//     getInput: (message: string, chainId: number, from: string): TypedMessage<any> => {
//       return {
//         domain: {
//           chainId,
//           name: 'Ether Mail',
//           verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
//           version: '1'
//         },
//         message: {
//           contents: message,
//           from: {
//             name: 'Cow',
//             wallets: [
//               from,
//               '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
//             ]
//           },
//           to: [
//             {
//               name: 'Alice',
//               wallets: [
//                 '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
//                 '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
//                 '0xB0B0b0b0b0b0B000000000000000000000000000'
//               ]
//             }
//           ]
//         },
//         primaryType: 'Mail',
//         types: {
//           EIP712Domain: [
//             { name: 'name', type: 'string' },
//             { name: 'version', type: 'string' },
//             { name: 'chainId', type: 'uint256' },
//             { name: 'verifyingContract', type: 'address' }
//           ],
//           Group: [
//             { name: 'name', type: 'string' },
//             { name: 'members', type: 'Person[]' }
//           ],
//           Mail: [
//             { name: 'from', type: 'Person' },
//             { name: 'to', type: 'Person[]' },
//             { name: 'contents', type: 'string' }
//           ],
//           Person: [
//             { name: 'name', type: 'string' },
//             { name: 'wallets', type: 'address[]' }
//           ]
//         }
//       };
//     }
//   }
// };
//
// const [accounts, setAccounts] = useState<string[]>([]);
// const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
// const [chainId, setChainId] = useState<number | undefined>(undefined);
// const [network, setNetwork] = useState<NetworkInfo | undefined>(undefined);
// const [balance, setBalance] = useState<number | undefined>(0);
// const [warningNetwork, setWarningNetwork] = useState<string | undefined>(undefined);
// // transaction
// const [transactionToAddress, setTransactionToAddress] = useState('');
// const [transactionAmount, setTransactionAmount] = useState<number>(0);
// const [transactionLink, setTransactionLink] = useState<string | undefined>(undefined);
//
// // signature
// const [signMessage, setSignMessage] = useState('Hello Alice!');
// const [signature, setSignature] = useState('');
// const [signMethod, setSignMethod] = useState('personalSign');
// const [signatureValidation, setSignatureValidation] = useState('');
//
//
// useEffect(() => {
//   if(wallet?.type=== "substrate")  navigate('/wallet-info');
// }, [wallet]);
//
// const makeRequest = useCallback(
//   function <T> (args: RequestArguments, callback: (rs: any) => void, errorCallback?: (e: Error) => void): void {
//     (wallet?.provider as EIP1193Provider).request(args)
//       .then((value) => callback(value))
//       .catch(async (e: Error) => {
//         errorCallback && errorCallback(e);
//         // @ts-ignore
//         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//         await message.error(`${e.code}: ${e.message}`);
//       })
//   },
//   [wallet]
// );
//
// useEffect(() => {
//   const _chainId = chains[0].id
//   if (_chainId) {
//     const cid = parseInt(_chainId.toString(), 16);
//
//     setChainId(cid);
//     // eslint-disable-next-line eqeqeq
//     const chain = chainList.find((network) => network.chainId == cid);
//
//     setNetwork(chain);
//   }
// }, [chains[0]]);
//
// const getBalance = useCallback(
//   (wallet : WalletState) => {
//     let total = 0;
//     wallet.accounts.forEach((account) => {
//       total += account.balance ? parseInt(Object.values(account.balance as { [s: string]: string; })[0]) : 0
//       setBalance(total)
//     });
//   },
//   [makeRequest]
// );
// const switchNetwork = useCallback((args : RequestArguments) =>{
//   const { params} = args
//   if(params){
//     setChain({chainId : (params as any[])[0].chainId as string, chainNamespace : 'evm'})
//   }
// },[wallet, chains])
//
// const generateRequestButton = useCallback(
//   (label: string, args: RequestArguments, callback?: (rs: Maybe<unknown>) => void, disabled?: boolean) =>
//     (
//       <Button
//         className='sub-wallet-btn sub-wallet-btn-small-size'
//         disabled={disabled}
//         key={label}
//         // eslint-disable-next-line react/jsx-no-bind
//         onClick={() => {
//           label.includes("Add") || label.includes("Switch") ? switchNetwork(args):makeRequest(args, callback || console.log);
//         }}
//       >
//         {label}
//       </Button>)
//   ,
//   [makeRequest]
// );
//
// useEffect(() => {
//     const init = async () => {
//       if (!wallet || !wallet.provider) {
//         return;
//       }
//
//       const _chainId = wallet.chains[0].id
//       if (_chainId) {
//         const cid = parseInt(_chainId.toString(), 16);
//
//         setChainId(cid);
//         // eslint-disable-next-line eqeqeq
//         const chain = chainList.find((network) => network.chainId == cid);
//
//         setNetwork(chain);
//
//         const _accounts = wallet.accounts;
//         _accounts && setAccounts(_accounts.map(({address})=> address));
//
//         if (_accounts && _accounts[0]) {
//           getBalance(wallet);
//
//         }
//       } else {
//         setWarningNetwork('Please select at least one button below to switch to EVM network');
//       }
//     };
//
//     init().catch(console.error);
//   }
//   , [getBalance, makeRequest, wallet]);
//
//
// const _onChangeTransactionToAddress = useCallback(
//   (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTransactionToAddress(e.target.value);
//   },
//   []
// );
//
// const _onChangeTransactionAmount = useCallback(
//   (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTransactionAmount(Number(e.target.value));
//   },
//   []
// );
//
// const _onChangeSignMessage = useCallback(
//   (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSignMessage(e.target.value);
//     setSignature('');
//     setSignatureValidation('');
//   },
//   []
// );
//
// const _onChangeSignMethod = useCallback(
//   (value: string) => {
//     setSignMethod(value);
//     setSignature('');
//     setSignatureValidation('');
//   },
//   []
// );
//
// const handlePermissionsRs = useCallback(
//   (response: Maybe<unknown>) => {
//     // @ts-ignore
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     const accounts = response[0]?.caveats[0].value as string[] || [];
//
//     setAvailableAccounts(accounts);
//   },
//   []
// );
//
// const sendTransaction = useCallback(
//   () => {
//     makeRequest({
//       method: 'eth_sendTransaction',
//       params: [{
//         from: accounts[0],
//         to: transactionToAddress,
//         value: '0x' + (transactionAmount * (10 ** (network?.nativeCurrency.decimals || 18))).toString(16),
//         maxFeePerGas: '0x2540be400',
//         maxPriorityFeePerGas: '0x3b9aca00'
//       }]
//     }, (transactionHash) => {
//       if (network?.explorers && network?.explorers.length && transactionHash) {
//         const explorer = network?.explorers[0]?.url;
//
//         setTransactionLink(explorer && (explorer + '/tx/' + (transactionHash as string)));
//       } else {
//         setTransactionLink(undefined);
//       }
//     });
//   },
//   [accounts, makeRequest, network?.explorers, network?.nativeCurrency.decimals, transactionAmount, transactionToAddress]
// );
//
// const signData = useCallback(
//   () => {
//     // @ts-ignore
//     if (!SIGN_METHODS[signMethod]) {
//       return;
//     }
//
//     const from = accounts[0];
//     const args = {} as RequestArguments;
//
//     if (signMethod === 'ethSign') {
//       args.method = SIGN_METHODS.ethSign.method;
//       args.params = [from, SIGN_METHODS.ethSign.getInput(signMessage)];
//     } else if (signMethod === 'personalSign') {
//       args.method = SIGN_METHODS.personalSign.method;
//       args.params = [SIGN_METHODS.personalSign.getInput(signMessage), from];
//     } else if (signMethod === 'signTypedData') {
//       args.method = SIGN_METHODS.signTypedData.method;
//       args.params = [SIGN_METHODS.signTypedData.getInput(signMessage), from];
//     } else if (signMethod === 'signTypedDatav3') {
//       args.method = SIGN_METHODS.signTypedDatav3.method;
//       args.params = [from, JSON.stringify(SIGN_METHODS.signTypedDatav3.getInput(signMessage, chainId || 0, from))];
//     } else if (signMethod === 'signTypedDatav4') {
//       args.method = SIGN_METHODS.signTypedDatav4.method;
//       args.params = [from, JSON.stringify(SIGN_METHODS.signTypedDatav4.getInput(signMessage, chainId || 0, from))];
//     }
//
//     makeRequest<string>(args, (signature) => {
//       setSignature(signature as string);
//     });
//   },
//   [accounts, chainId, makeRequest, signMessage, signMethod]
// );
//
// const verifySignature = useCallback(
//   () => {
//     const from = accounts[0];
//     let recoveredAddress = '';
//
//     if (signMethod === 'ethSign') {
//       setSignatureValidation('OK');
//     } else if (signMethod === 'personalSign') {
//       recoveredAddress = recoverPersonalSignature({
//         data: SIGN_METHODS.personalSign.getInput(signMessage),
//         sig: signature
//       });
//     } else if (signMethod === 'signTypedData') {
//       recoveredAddress = recoverTypedSignatureLegacy({
//         data: SIGN_METHODS.signTypedData.getInput(signMessage),
//         sig: signature
//       });
//     } else if (signMethod === 'signTypedDatav3') {
//       recoveredAddress = recoverTypedSignature({
//         data: SIGN_METHODS.signTypedDatav3.getInput(signMessage, chainId || 0, from),
//         sig: signature
//       });
//     } else if (signMethod === 'signTypedDatav4') {
//       recoveredAddress = recoverTypedSignature_v4({
//         data: SIGN_METHODS.signTypedDatav4.getInput(signMessage, chainId || 0, from),
//         sig: signature
//       });
//     }
//
//     setSignatureValidation(recoveredAddress);
//
//     if (recoveredAddress.toLowerCase() === from.toLowerCase()) {
//       // eslint-disable-next-line no-void
//       void message.success('Verify Success!');
//     } else {
//       // eslint-disable-next-line no-void
//       void message.error('Signed address is different from current address');
//     }
//   },
//   [accounts, chainId, signMessage, signMethod, signature]
// );


interface Props extends ThemeProps{};



require('./EvmWalletInfo.scss');

function Component ({className}: Props): React.ReactElement {
  const [{wallet},] = useConnectWallet()
  const [{chains}, setChain] = useSetChain()
  const navigate = useNavigate();

  useEffect(() => {
    wallet?.type === "substrate" && navigate("/wallet-info")
  }, []);
  return (
    <div className={CN(className, '__evm-wallet-info-page')}>
      <div className={CN('__evm-wallet-info-page', className)}>
        <HeaderWalletInfo />
        <div className={'__evm-wallet-info-body'}>
          <div className={'__evm-wallet-info-box'}>
            <div className={'__evm-wallet-info-label'}>
              Account List
            </div>
            <AccountList />
          </div>
          <div className={'__evm-wallet-info-box'}>
            <div className={'__evm-wallet-info-label'}>
              Metadata
            </div>
            <WalletMetadata />
          </div>
        </div>
      </div>
    </div>
);
}


const EvmWalletInfo = styled(Component)<Props>(({theme: {token}})=>{

  return{

    '&.__evm-wallet-info-page': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: token.padding
    },

    '.__evm-wallet-info-body': {
      display: 'flex',
      gap: token.paddingMD,
      flexWrap: 'wrap',
      width: '100%'
    },

    '.__evm-wallet-info-box': {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 576px'
    },

    '.__evm-wallet-info-label': {
      fontSize: 24,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '32px',
      marginBottom: token.margin
    }

  }
})


export default EvmWalletInfo;
