import { ethers } from "ethers";
import { useState, useEffect } from "react";

export interface AccountInfo {
  address: string;
  balance?: string;
}

interface WalletInfo {
  walletId: string;
  encryptedMnemonic: string; // 保存助记词的加密版本
  accounts: AccountInfo[]; // 由助记词生成的账户列表
}

const WALLET_STORAGE_KEY = "walletList";

const useWalletStorage = () => {
  const [walletList, setWalletList] = useState<WalletInfo[]>([]);

  // 检查当前 localStorage 中是否保存了钱包列表
  useEffect(() => {
    const storedWallets = localStorage.getItem(WALLET_STORAGE_KEY);
    if (storedWallets) {
      try {
        const parsedWallets: WalletInfo[] = JSON.parse(storedWallets);
        setWalletList(parsedWallets);
      } catch (error) {
        console.error("Failed to parse walletList from localStorage", error);
      }
    }
  }, []);

  // 保存钱包信息到 localStorage 中
  const saveWalletToStorage = (wallets: WalletInfo[]) => {
    setWalletList(wallets);
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
  };

  // 添加新钱包
  const addNewWallet = (encryptedMnemonic: string, accounts: AccountInfo[]) => {
    const newWallet: WalletInfo = {
      walletId: generateUniqueId(),
      encryptedMnemonic,
      accounts,
    };
    const updatedWalletList = [...walletList, newWallet];
    saveWalletToStorage(updatedWalletList);
  };

  // 删除钱包
  const removeWallet = (walletId: string) => {
    const updatedWalletList = walletList.filter(
      (wallet) => wallet.walletId !== walletId
    );
    saveWalletToStorage(updatedWalletList);
  };

  // 删除账户
  const removeAccount = (walletId: string, address: string) => {
    const updatedWalletList = walletList.map((wallet) => {
      if (wallet.walletId === walletId) {
        return {
          ...wallet,
          accounts: wallet.accounts.filter(
            (account) => account.address !== address
          ),
        };
      }
      return wallet;
    });
    saveWalletToStorage(updatedWalletList);
  };

  // 检查钱包是否只包含一个账户
  const isSingleAccountWallet = (walletId: string) => {
    const wallet = walletList.find((wallet) => wallet.walletId === walletId);
    return wallet ? wallet.accounts.length === 1 : false;
  };

  return {
    walletList,
    addNewWallet,
    removeWallet,
    removeAccount,
    isSingleAccountWallet,
    setWalletList,
    generateUniqueId,
  };
};

export const useProvider = () => {
  return new ethers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/7fe24f65c98f403db5c7ea57c0974161"
  );
};

// 生成唯一 ID 的简单函数
export const generateUniqueId = () =>
  "_" + Math.random().toString(36).substr(2, 9);

export default useWalletStorage;
