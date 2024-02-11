import {NetworkItemType} from "../types";


export const NetworkInfo : Record<string, NetworkItemType> = {
  'Polkadot': {
    slug: 'polkadot',
    name: 'Polkadot',
    namespace: 'substrate'
  },
  'HydraDX': {
    slug: 'hydradx_main',
    name: 'HydraDX',
    namespace: 'substrate'
  },
  'Astar Network': {
    slug: 'astar',
    name: 'Astar Network',
    namespace: 'substrate'
  },
  'Ethereum Mainnet': {
    slug: 'ethereum',
    name: 'Ethereum Mainnet',
    namespace: 'evm'
  },
  'Moonbeam': {
    slug: 'moonbeam',
    name: 'Moonbeam',
    namespace: 'evm'
  },
  'Moonriver': {
    slug: 'moonriver',
    name: 'Moonriver',
    namespace: 'evm'
  },
  "MoonbaseAlpha": {
    slug: "moonbase",
    name: "Moonbase Alpha",
    namespace: 'evm'
  },
  'Astar': {
    slug: 'astar',
    name: 'Astar',
    namespace: 'evm'
  },
  'Shiden': {
    slug: 'shiden',
    name: 'Shiden',
    namespace: 'evm'
  },
  'Mumbai': {
    slug: 'polygon',
    name: 'Polygon',
    namespace: 'evm'
  }
}
