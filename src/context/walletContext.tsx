import { message } from 'antd';
import { ethers } from 'ethers';
import { createContext, useContext, useState } from 'react';

// Context to manage wallet and contract address globally
interface WalletContextType {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  contractAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setContractAddress: (address: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string>('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await browserProvider.send('eth_requestAccounts', []);
        const signer = await browserProvider.getSigner();
        const userAddress = await signer.getAddress();
        setProvider(browserProvider);
        setAccount(userAddress);
        message.success('Wallet connected successfully');
      } catch (error) {
        console.error(error);
        message.error('Failed to connect wallet');
      }
    } else {
      message.error('Please install a Web3 wallet, such as MetaMask.');
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
    setContractAddress('');
    message.info('Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{ provider, account, contractAddress, connectWallet, disconnectWallet, setContractAddress }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};