/* eslint-disable @typescript-eslint/no-floating-promises */
// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import {Button, message, SwList} from "@subwallet/react-ui";
import React, {useCallback, useEffect, useState} from 'react';

import { useConnectWallet } from "@subwallet_connect/react";
import { EIP1193Provider, SubstrateProvider } from "@subwallet_connect/common";
import { Web3Block } from "@subwallet/react-ui";
import { GeneralEmptyList } from "./empty";
import { Theme, ThemeProps } from "../types";
import CN from "classnames";
import styled, { useTheme } from "styled-components";
import { WalletState } from "@subwallet_connect/core";
import { Maybe } from "@metamask/providers/dist/utils";
import { RequestArguments } from "../types";
import { METHOD_MAP, SIGN_METHODS } from "../utils/methods";

interface Props extends ThemeProps{};


type AccountMapType = {
  account: string,
  index: number
}

function Component ({className}: Props): React.ReactElement {
  const [{ wallet},] = useConnectWallet();
  const renderEmpty = useCallback(() => <GeneralEmptyList />, []);
  const [ accountsMap, setAccountMap ] = useState<AccountMapType[]>([])




  const signDummy = useCallback(
    async (address: string) => {
      const signer = wallet?.signer;

      if (signer && signer.signRaw) {
        const signPromise = signer.signRaw({ address, data: 'This is dummy message', type: 'bytes' });
        const key = 'sign-status';

        message.loading({ content: 'Signing', key });
        signPromise.then((rs: any) => {
          message.success({ content: 'Sign Successfully!', key });
        }).catch((error) => {
          console.error(error);
          message.warning({ content: 'Sign Failed or Cancelled!', key });
        });
      }else{
          await (wallet?.provider as SubstrateProvider).signDummy(address, 'hello sign dummy', undefined)
      }
    },
    [wallet?.signer]
  );

  const makeRequest = useCallback(
    function <T> (args: RequestArguments, callback: (rs: any) => void, errorCallback?: (e: Error) => void): void {
      (wallet?.provider as EIP1193Provider).request(args)
        .then((value) => callback(value))
        .catch(async (e: Error) => {
          errorCallback && errorCallback(e);
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          await message.error(`${e.code}: ${e.message}`);
        })
    },
    [wallet]
  );

  const signData = useCallback(
    (account: string) => {

      const from = account;
      const args = {} as RequestArguments;

      args.method = SIGN_METHODS.personalSign.method;
      args.params = [SIGN_METHODS.personalSign.getInput('This is personal sign message'), from];


      makeRequest<string>(args, (signature) => {
        console.log('Personal Sign', signature)
      });
    },
    [makeRequest]
  );





  const handlePermissionsRs = useCallback(
    (response: Maybe<unknown>) => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accounts = response[0]?.caveats[0].value as string[] || [];

    },
    []
  );

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





  const onSignClicked = useCallback(
     (address: string) => {
      return async () => {
        if(wallet){
          wallet.type === 'evm' ? signData(address) : await signDummy(address);
        }
      };
    },
    [signDummy]
  );



  useEffect(() => {
    const accountMap = wallet?.accounts.reduce((acc, account, index)=>{
      acc.push({account: account.address, index})
      return acc
    }, [] as AccountMapType[])

    setAccountMap(accountMap || []);
  }, [wallet]);

  const accountItem = useCallback(({ account, index }: AccountMapType) => {

    const _middleItem = (
      <div className={'__account-item-middle'}>
        <div className={'__account-item-info'}>
          <span className='__account-item__title'>Wallet name:</span>
          <span className='__account-item__content'>Account { index + 1 }</span>
        </div>
        <div className={'__account-item-info'}>
          <span className='__account-item__title'>Address:</span>
          <span className='__account-item__content'>{account}</span>
        </div>
        <div className={'__account-item-info'}>
          <Button
            className={CN('__wallet-btn', 'sub-wallet-sign-btn')}
            key={account}
            onClick={onSignClicked(account)}
            block={true}
          >
            Sign Dummy
          </Button>

          <Button
            className={CN('__wallet-btn', 'sub-wallet-transaction-btn')}
            key={account}
            onClick={onSignClicked(account)}
            block={true}
          >
            Transaction
          </Button>
        </div>
      </div>
    )


    return(
      <Web3Block
        leftItem={<div key={index}></div>}
        className={'__account-item'}
        middleItem={_middleItem}
      />
    )
  }, [wallet])


  return (
   <SwList
     className={CN('__account-list', className)}
     list={accountsMap}
     renderWhenEmpty={renderEmpty}
     renderItem={accountItem}
   />

  );
}

export const AccountList = styled(Component)<Props>( ({theme: {token}}) => {
    return{

      '&.__account-list': {
        position: 'relative',
        width: '100%'
      },

      '.__account-item': {
        padding: token.padding,
        width: '100%',
        backgroundColor: token.colorBgSecondary,
        borderRadius: 8,
        '&:hover': {
          backgroundColor: '#252525'
        }
      },

      '.__account-item-middle': {
        display: 'flex',
        flexDirection: 'column',
        gap: token.paddingSM,
        overflow: 'hidden'
      },

      '.__account-item-info': {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        overflow: 'hidden',
        gap: token.paddingSM
      },

      '.__account-item__title': {
        fontSize: token.fontSizeHeading6,
        fontStyle: 'normal',
        fontWeight: 600,
        width: 128,
        lineHeight: '22px',
        overflow: 'hidden'
      },


      '.__account-item__content': {
        textOverflow: 'ellipsis',
        fontSize: token.fontSizeHeading6,
        overflow: 'hidden',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '22px',
        color: token.colorTextLight4
      },

      '.sub-wallet-transaction-btn': {
        backgroundColor: "#252525",

        '&:hover': {
          backgroundColor: token.colorBgSecondary
        }
      }
    }
})

export default AccountList;
