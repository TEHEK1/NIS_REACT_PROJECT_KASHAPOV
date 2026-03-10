import Web3 from 'web3';
import type { TransferEvent } from '@/types';

const PUBLIC_RPCS = [
  'https://ethereum-rpc.publicnode.com',
  'https://rpc.ankr.com/eth',
  'https://eth.llamarpc.com',
];

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
  private walletWeb3: Web3 | null = null;
  private readOnlyWeb3: Web3 | null = null;

  get isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;
  }

  getReadOnlyWeb3(): Web3 {
    if (!this.readOnlyWeb3) {
      if (window.ethereum) {
        this.readOnlyWeb3 = new Web3(window.ethereum);
      } else {
        this.readOnlyWeb3 = new Web3(new Web3.providers.HttpProvider(PUBLIC_RPCS[0]!));
      }
    }
    return this.readOnlyWeb3;
  }

  getWeb3(): Web3 | null {
    if (!this.walletWeb3 && window.ethereum) {
      this.walletWeb3 = new Web3(window.ethereum);
    }
    return this.walletWeb3;
  }

  async connectWallet(): Promise<string[]> {
    if (!window.ethereum) throw new Error('MetaMask не установлен');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    this.walletWeb3 = new Web3(window.ethereum);
    this.readOnlyWeb3 = this.walletWeb3;
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
    const web3 = this.getReadOnlyWeb3();
    const block = await web3.eth.getBlockNumber();
    return Number(block);
  }

  async getGasPrice(): Promise<string> {
    const web3 = this.getReadOnlyWeb3();
    const gasPrice = await web3.eth.getGasPrice();
    return web3.utils.fromWei(gasPrice, 'gwei');
  }

  getERC721Contract(contractAddress: string) {
    const web3 = this.getReadOnlyWeb3();
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

  async getContractInfo(contractAddress: string): Promise<{ name: string; symbol: string; totalSupply: string }> {
    const contract = this.getERC721Contract(contractAddress);
    const [name, symbol, totalSupply] = await Promise.all([
      contract.methods.name().call() as Promise<string>,
      contract.methods.symbol().call() as Promise<string>,
      contract.methods.totalSupply().call().catch(() => '?') as Promise<string>,
    ]);
    return { name, symbol, totalSupply: String(totalSupply) };
  }

  async getTransferHistory(contractAddress: string, tokenId: number): Promise<TransferEvent[]> {
    const web3 = this.getReadOnlyWeb3();
    const TRANSFER_TOPIC = web3.utils.sha3('Transfer(address,address,uint256)')!;
    const tokenIdHex = web3.utils.padLeft(web3.utils.toHex(tokenId), 64);
    const currentBlock = await web3.eth.getBlockNumber();
    const fromBlock = Number(currentBlock) - 50_000;

    const logs = await web3.eth.getPastLogs({
      address: contractAddress,
      topics: [TRANSFER_TOPIC, null, null, tokenIdHex],
      fromBlock: Math.max(fromBlock, 0),
      toBlock: 'latest',
    });

    const events: TransferEvent[] = [];

    for (const log of logs) {
      if (typeof log === 'string') continue;
      const from = '0x' + String(log.topics?.[1] ?? '').slice(26);
      const to = '0x' + String(log.topics?.[2] ?? '').slice(26);
      const block = await web3.eth.getBlock(Number(log.blockNumber ?? 0));
      const timestamp = Number(block.timestamp) * 1000;
      const isMint = from === '0x' + '0'.repeat(40);

      events.push({
        txHash: String(log.transactionHash ?? ''),
        from,
        to,
        blockNumber: Number(log.blockNumber ?? 0),
        timestamp,
        type: isMint ? 'mint' : 'transfer',
      });
    }

    return events.reverse();
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
