import {Theme, ThemeProps} from "../../types";
import { Button, Icon } from '@subwallet/react-ui';
import { LightbulbFilament , Vault } from 'phosphor-react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, {useTheme} from 'styled-components';
import {openInNewTab} from "../../utils/window";
import {WEBSITE_URL} from "../../constants/common";
import CN from "classnames";

type Props = ThemeProps & {
  visible : boolean
};

const contentOfFooter = {
  title: 'Crowdloan unlock, then what?',
  description: 'There\'re multiple ways you can play with your unlocked DOT, ' +
    'such as native staking, liquid staking, or lending. ' +
    'Check out SubWallet Dashboard for curated options with competitive APY to earn yield on your DOT.'
}

const Component: React.FC<Props> = ({ className, visible }: Props) => {
  const navigate = useNavigate();
  const { token } = useTheme() as Theme;
  if(!visible){
    return ( <></> )
  }
  return (
    <div className={CN(className, '__wallet-footer')}>
      <div className={'__note-box'}>
        <div className={'__title-wrapper'}>
          <Icon
            className={'__token-icon'}
            phosphorIcon={LightbulbFilament}
            weight={'fill'}
            iconColor={ token["gold-6"] }
          />

          <div className={'__title'}>
            {contentOfFooter.title}
          </div>
        </div>

        <div className={'__content'}>{contentOfFooter.description}</div>
      </div>

      <Button
        className={'__footer-button'}
        contentAlign={'left'}
        icon={
          <Icon
            className='__footer-button-icon'
            phosphorIcon={Vault}
            size='md'
            weight='fill'
          />
        }
        onClick={openInNewTab(WEBSITE_URL)}
      >
        <div className={'__footer-button-content'}>
          <div className={'__footer-button-title'}>{'Rewards: 14.8% - 18.5%'}</div>
          <div className={'__footer-button-subtitle'}>{'Earn now'}</div>
        </div>
      </Button>
    </div>
  );
};

const WalletFooter = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {
    borderTop: `2px solid ${token.colorBgDivider}`,
    display: 'flex',
    gap: token.size,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: token.sizeLG,
    width: '100%',
    height: 150,
    paddingBottom: token.paddingMD,
    background: token.colorBgDefault,
    opacity: 1,
    marginBottom: 42,
    zIndex: 10,
    '.__note-box': {
      maxWidth: 684,
      flex: '1 0 300px'
    },
    '.__title-wrapper': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: token.marginXS
    },
    '.__token-icon': {
      color: token.colorSuccess,
      fontSize: 24,
      width: 40,
      height: 40,
      justifyContent: 'center'
    },
    '.__title': {
      fontSize: token.fontSizeLG,
      lineHeight: token.lineHeightLG,
      color: token.colorTextLight3
    },
    '.__content': {
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      color: token.colorTextLight4
    },
    '.__footer-button': {
      height: 72,
      flex: 1,
      paddingRight: token.paddingSM,
      paddingLeft: token.paddingSM,
      gap: token.size,
      maxWidth: 384
    },
    '.__footer-button-icon': {
      width: 40,
      height: 40,
      justifyContent: 'center'
    },
    '.__footer-button-content': {
      textAlign: 'left'
    },
    '.__footer-button-title': {
      fontSize: token.fontSizeLG,
      lineHeight: token.lineHeightLG,
      color: token.colorTextLight1,
      marginBottom: token.marginXXS
    },
    '.__footer-button-subtitle': {
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      color: token.colorTextLight3
    },
    '@media (max-width : 767px)': {
      '.__footer-button': {
        minWidth: '100%'
      },

      '.__buttons-block': {
        '.ant-btn': {
          minWidth: '100%'
        }
      }
    },

  };
});

export default WalletFooter;
