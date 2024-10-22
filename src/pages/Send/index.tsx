import React, { useState } from "react";
import { Button, Input, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import styles from "./index.module.less";
import { ethers } from "ethers";
import { useProvider } from "../../hooks/useWalletStorage";

const Send: React.FC = () => {
  const provider = useProvider();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [gasEstimate, setGasEstimate] = useState<string>("");
  const navigate = useNavigate();

  const handleEstimateGas = async () => {
    if (!recipientAddress || !amount) {
      setGasEstimate("");
      return;
    }
    try {
      const gasLimit = await provider.estimateGas({
        to: recipientAddress,
        value: ethers.parseUnits(amount, "ether"),
      });
      setGasEstimate(ethers.formatEther(gasLimit));
    } catch (error) {
      console.error("Error estimating gas:", error);
      setGasEstimate("");
    }
  };

  const handleSendTransaction = async () => {
    if (!recipientAddress || !amount) {
      Toast.show("请输入收款地址和金额");
      return;
    }

    try {
      const selectedAccount = localStorage.getItem("selectedAccount");
      const encryptedWallet = localStorage.getItem("encryptedWallet");
      const password = localStorage.getItem("walletUnlockPassword");

      if (!selectedAccount || !encryptedWallet || !password) {
        Toast.show("未找到有效的钱包信息");
        return;
      }

      // 解密钱包
      const wallet = await ethers.Wallet.fromEncryptedJson(
        encryptedWallet,
        password
      );
      const signer = wallet.connect(provider);

      // 检查余额是否足够
      const balance = await provider.getBalance(selectedAccount);
      const ethBalance = ethers.formatEther(balance);
      if (parseFloat(ethBalance) < parseFloat(amount)) {
        Toast.show("余额不足");
        return;
      }

      // 发送交易
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.parseUnits(amount, "ether"),
      });

      Toast.show("交易已发送，等待确认");
      await tx.wait();
      Toast.show("交易成功");
      navigate("/");
    } catch (error) {
      console.error("Error sending transaction:", error);
      Toast.show("发送交易失败");
    }
  };

  return (
    <ResponsiveContainer>
      <div className={styles.sendPage}>
        <Input
          placeholder="请输入收款地址"
          value={recipientAddress}
          onChange={(value) => setRecipientAddress(value)}
          style={{ marginBottom: "16px" }}
        />
        <Input
          placeholder="请输入发送金额 (ETH)"
          value={amount}
          onChange={(value) => {
            setAmount(value);
            handleEstimateGas();
          }}
          style={{ marginBottom: "16px" }}
        />
        {gasEstimate && <p>预计 Gas: {gasEstimate} ETH</p>}
        <Button color="primary" onClick={handleSendTransaction}>
          发送
        </Button>
      </div>
    </ResponsiveContainer>
  );
};

export default Send;
