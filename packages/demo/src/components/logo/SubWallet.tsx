// Copyright 2019-2022 @polkadot/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Web3Onboard from "../../../assets/web3Onboard";
import { SubWallet } from "../../../assets";

interface Props {
  width?: number | string;
  height?: number | string;
}

const SubWalletLogo: React.FC<Props> = ({ height = 16, width = 16 }: Props) => {
  return (
    <div dangerouslySetInnerHTML={{__html : SubWallet}} style={{ width, height}}/>
  );
};

export default SubWalletLogo;
