// src/pages/ImportWallet.tsx
import React, { useState } from "react";
import { Button, Input, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import useWalletStorage from "../../hooks/useWalletStorage";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import styles from "./index.module.less";
import { ethers, HDNodeWallet } from "ethers";

interface WalletInfo {
  walletId: string;
  accounts: { address: string }[];
  mnemonic?: string;
}

const ImportWallet: React.FC = () => {
  const [mnemonic, setMnemonic] = useState("");
  const { walletList, addNewWallet } = useWalletStorage();
  const navigate = useNavigate();

  const handleImportWallet = async () => {
    if (mnemonic.trim() === "") {
      Toast.show("请输入助记词");
      return;
    }

    try {
      // 使用助记词恢复钱包
      const wallet = HDNodeWallet.fromPhrase(mnemonic);
      const address = wallet.address;

      // 检查钱包列表中是否已存在相同的地址
      const existingWallet = walletList.find((wallet) =>
        wallet.accounts.some((account) => account.address === address)
      );
      if (existingWallet) {
        Toast.show(`该钱包已存在，重复的钱包ID: ${existingWallet.walletId}`);
        return;
      }

      // 导入新钱包
      const accounts = [{ address }];
      addNewWallet(mnemonic, accounts);
      Toast.show("钱包导入成功");
      navigate("/");
    } catch (error) {
      Toast.show("无效的助记词");
    }
  };

  return (
    <ResponsiveContainer>
      <div className={styles.importWalletPage}>
        <Input
          placeholder="请输入助记词"
          value={mnemonic}
          onChange={(value) => setMnemonic(value)}
          style={{ marginBottom: "16px" }}
        />
        <Button color="primary" onClick={handleImportWallet}>
          导入钱包
        </Button>
      </div>
    </ResponsiveContainer>
  );
};

export default ImportWallet;
