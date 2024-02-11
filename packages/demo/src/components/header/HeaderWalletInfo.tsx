import {Theme, ThemeProps} from "../../types";
import { WalletState } from "@subwallet_connect/core";
import CN from "classnames";
import { useConnectWallet } from "@subwallet_connect/react";
import LogoWithSubIcon from "../logo/LogoWithSubIcon";
import { Button, Icon } from "@subwallet/react-ui";
import { Wallet } from "@phosphor-icons/react";
import styled, {useTheme} from "styled-components";
import {useCallback} from "react";

interface Props extends ThemeProps{};



const Component = ({ className }: Props)=> {
  const  [{ wallet }, connect  , disconnect ] = useConnectWallet();
  const { token  } = useTheme() as Theme


  const onClickToDisconnect = useCallback(async ()=>{
    if(wallet){
      await disconnect(wallet);
    }

  }, [wallet])

  if(!wallet){
    return (
      <></>
    )
  }


  return(
    <div className={CN(className, '__wallet-info-header')}>
      <div className={CN('__wallet-common-info')}>
        <LogoWithSubIcon icon={wallet.icon} type={wallet.type}/>
        <div className={'__wallet-info-name'}>{ wallet.label }</div>
      </div>
      <Button
        icon={
        <Icon
          phosphorIcon={ Wallet }
          weight={'fill'}
        />
      }
        onClick={onClickToDisconnect}
        shape={'circle'}
        schema={'danger'}
      >
        Disconnect
      </Button>
    </div>
  )
}


export const HeaderWalletInfo = styled(Component)<Props>(({theme: {token}}) => {

  return({
    '&.__wallet-info-header': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: `${token.paddingMD + 4}px 0 `,
      borderBottom: '2px solid',
      borderColor: token.colorBgDivider
    },

    '.__wallet-common-info': {
      display: 'flex',
      gap: token.padding,
      alignItems: 'center',
      '.__wallet-info-name': {
        fontSize: 30,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '38px'
      }
    }



  })
})
