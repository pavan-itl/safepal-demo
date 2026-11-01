export interface Token {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  price: number;
  change24h: number;
  value: number;
  network: string;
  contractAddress?: string;
  decimals: number;
  isNative: boolean;
  isVerified: boolean;
}

export interface Wallet {
  id: string;
  name: string;
  address: string;
  type: 'software' | 'hardware' | 'imported' | 'watch';
  networks: string[];
  tokens: Token[];
  totalValue: number;
  createdAt: Date;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake' | 'unstake' | 'claim';
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  token: Token;
  amount: number;
  value: number;
  fromAddress: string;
  toAddress: string;
  hash: string;
  network: string;
  fee: number;
  feeToken: string;
  timestamp: Date;
  blockNumber?: number;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: number;
  toAmount: number;
  rate: number;
  priceImpact: number;
  fee: number;
  feeToken: string;
  minReceived: number;
  route: string[];
  estimatedTime: number;
}

export interface Network {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  rpcUrl: string;
  explorerUrl: string;
  chainId: number;
  isTestnet: boolean;
  isEVM: boolean;
  nativeToken: Token;
  isCustom: boolean;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change1h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  sparkline: number[];
}

export interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  collectionIcon: string;
  network: string;
  contractAddress: string;
  tokenId: string;
  rarity?: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface DApp {
  id: string;
  name: string;
  icon: string;
  url: string;
  description: string;
  category: string;
  networks: string[];
  isFeatured: boolean;
  isVerified: boolean;
}

export interface StakingPosition {
  id: string;
  token: Token;
  amount: number;
  value: number;
  apy: number;
  rewards: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'unbonding' | 'claimed';
  validator?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  wallets: Wallet[];
  preferences: {
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    biometric: boolean;
    autoLock: number;
  };
  security: {
    hasPassword: boolean;
    hasBiometric: boolean;
    has2FA: boolean;
    backupCompleted: boolean;
  };
}