// Import necessary libraries
import { createContext, useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import YangTokenABI from '../abi/YangTokenABI.json'; // Assume ABI is available in the project
import { message } from 'antd';
import { useWalletContext } from '../context/walletContext';


declare global {
  interface Window {
    ethereum?: any;
  }
}


export const useBalance = () => {
  const { provider, account, contractAddress } = useWalletContext();
  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (provider && account && contractAddress) {
      try {
        const contract = new ethers.Contract(contractAddress, YangTokenABI, provider);
        const decimals = await contract.decimals();
        const balance = await contract.balanceOf(account);
        setBalance(ethers.formatUnits(balance.toString(), decimals));
      } catch (error) {
        console.error(error);
        message.error('Failed to fetch balance');
      }
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBalance();
    })();
  }, [provider, account, contractAddress]);

  return { balance, fetchBalance };
};


export const useTransferToken = () => {
  const { provider, contractAddress } = useWalletContext();
  const { fetchBalance } = useBalance();

  const transferToken = async (to: string, amount: string) => {
    if (provider) {
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, YangTokenABI, signer);
        const decimals = await contract.decimals();
        const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
        await tx.wait();
        message.success('Transfer successful');
        fetchBalance(); // Update balance after transfer
      } catch (error) {
        console.error(error);
        message.error('Transfer failed');
      }
    } else {
      message.error('Please connect your wallet first');
    }
  };

  return transferToken;
};


export const useGetTotalSupply = () => {
  const { provider, contractAddress } = useWalletContext();
  const [totalSupply, setTotalSupply] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (provider && contractAddress) {
        try {
          const contract = new ethers.Contract(contractAddress, YangTokenABI, provider);
          const supply = await contract.totalSupply();
          const decimals = await contract.decimals();
          setTotalSupply(ethers.formatUnits(supply, decimals));
        } catch (error) {
          console.error(error);
          message.error('Failed to fetch total supply');
        }
      }
    };
    fetchTotalSupply();
  }, [provider, contractAddress]);

  return totalSupply;
};


export const useTotalSupply = () => {
  const { provider, contractAddress } = useWalletContext();
  const [totalSupply, setTotalSupply] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (provider && contractAddress) {
        try {
          const contract = new ethers.Contract(contractAddress, YangTokenABI, provider);
          const supply = await contract.totalSupply();
          const decimals = await contract.decimals();
          setTotalSupply(ethers.formatUnits(supply, decimals));
        } catch (error) {
          console.error(error);
          message.error('Failed to fetch total supply');
        }
      }
    };
    fetchTotalSupply();
  }, [provider, contractAddress]);

  return totalSupply;
};