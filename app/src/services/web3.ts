import Web3 from 'web3';

const ERC721_ABI = [
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'ownerOf', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'tokenURI', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon',
  80001: 'Mumbai Testnet',
  56: 'BNB Smart Chain',
  42161: 'Arbitrum One',
  10: 'Optimism',
};

class Web3Service {
  private web3: Web3 | null = null;

  get isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;
  }

  getWeb3(): Web3 | null {
    if (!this.web3 && window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    }
    return this.web3;
  }

  async connectWallet(): Promise<string[]> {
    if (!window.ethereum) throw new Error('MetaMask не установлен');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    this.web3 = new Web3(window.ethereum);
    return accounts;
  }

  async getAccounts(): Promise<string[]> {
    const web3 = this.getWeb3();
    if (!web3) return [];
    return web3.eth.getAccounts();
  }

  async getBalance(address: string): Promise<string> {
    const web3 = this.getWeb3();
    if (!web3) throw new Error('Web3 не инициализирован');
    const balanceWei = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balanceWei, 'ether');
  }

  async getChainId(): Promise<number> {
    const web3 = this.getWeb3();
    if (!web3) throw new Error('Web3 не инициализирован');
    const chainId = await web3.eth.getChainId();
    return Number(chainId);
  }

  getChainName(chainId: number): string {
    return CHAIN_NAMES[chainId] ?? `Unknown Chain (${chainId})`;
  }

  async getBlockNumber(): Promise<number> {
    const web3 = this.getWeb3();
    if (!web3) throw new Error('Web3 не инициализирован');
    const block = await web3.eth.getBlockNumber();
    return Number(block);
  }

  async getGasPrice(): Promise<string> {
    const web3 = this.getWeb3();
    if (!web3) throw new Error('Web3 не инициализирован');
    const gasPrice = await web3.eth.getGasPrice();
    return web3.utils.fromWei(gasPrice, 'gwei');
  }

  getERC721Contract(contractAddress: string) {
    const web3 = this.getWeb3();
    if (!web3) throw new Error('Web3 не инициализирован');
    return new web3.eth.Contract(ERC721_ABI, contractAddress);
  }

  async getNFTOwner(contractAddress: string, tokenId: number): Promise<string> {
    const contract = this.getERC721Contract(contractAddress);
    return contract.methods.ownerOf(tokenId).call() as Promise<string>;
  }

  async getNFTTokenURI(contractAddress: string, tokenId: number): Promise<string> {
    const contract = this.getERC721Contract(contractAddress);
    return contract.methods.tokenURI(tokenId).call() as Promise<string>;
  }

  onAccountsChanged(callback: (accounts: string[]) => void): () => void {
    const handler = (...args: unknown[]) => callback(args[0] as string[]);
    window.ethereum?.on('accountsChanged', handler);
    return () => window.ethereum?.removeListener('accountsChanged', handler);
  }

  onChainChanged(callback: (chainId: string) => void): () => void {
    const handler = (...args: unknown[]) => callback(args[0] as string);
    window.ethereum?.on('chainChanged', handler);
    return () => window.ethereum?.removeListener('chainChanged', handler);
  }
}

export const web3Service = new Web3Service();
