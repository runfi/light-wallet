import React, { useState } from "react";
import { Button, Input, Toast } from "antd-mobile";
import useWalletStorage from "../../hooks/useWalletStorage";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import styles from "./index.module.less";
import { useNavigate } from "react-router-dom";
import { ethers, HDNodeWallet } from "ethers";

const GenerateMnemonic: React.FC = () => {
  const { addNewWallet } = useWalletStorage();
  const [unlockPassword, setUnlockPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState(
    localStorage.getItem("walletUnlockPassword")
  );
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();

  const handleGenerateMnemonic = async () => {
    try {
      if (!storedPassword) {
        // 如果没有保存的解锁密码，生成新助记词并使用输入的密码加密
        if (unlockPassword.trim() === "") {
          Toast.show("请输入解锁密码");
          return;
        }
        localStorage.setItem("walletUnlockPassword", unlockPassword);
        await generateAndSaveWallet(unlockPassword);
      } else {
        // 如果已有解锁密码，引导用户输入并验证
        if (inputPassword !== storedPassword) {
          Toast.show("密码不正确");
          return;
        }
        await generateAndSaveWallet(inputPassword);
      }
    } catch (error) {
      Toast.show("创建钱包失败");
      console.error("Error generating wallet:", error);
    }
  };

  const generateAndSaveWallet = async (password: string) => {
    // 使用 ether.js 生成助记词
    const wallet = ethers.Wallet.createRandom();
    const mnemonic = wallet!.mnemonic!.phrase;
    console.log("助记词:", mnemonic);

    // 使用输入的密码进行加密
    const encryptedJson = await wallet.encrypt(password);

    // // 使用助记词派生第一个账户
    // const hdNode = HDNodeWallet.fromPhrase(mnemonic);
    // const firstDerivedWallet = hdNode.deriveChild(0);

    // 生成一个账户并添加到钱包列表，一个是钱包地址，一个是第一个派生地址
    const accounts = [{ address: wallet.address }];

    addNewWallet(mnemonic, accounts);
    localStorage.setItem("encryptedWallet", encryptedJson);
    Toast.show("钱包创建成功");
    navigate("/show-mnemonic", { state: { mnemonic } });
  };

  return (
    <ResponsiveContainer>
      <div className={styles.generateMnemonicPage}>
        {!storedPassword ? (
          <div className={styles.passwordInputContainer}>
            <Input
              placeholder="请输入新密码"
              value={unlockPassword}
              onChange={(value) => setUnlockPassword(value)}
              type="password"
              style={{ marginBottom: "16px" }}
            />
            <Button color="primary" onClick={handleGenerateMnemonic}>
              使用新密码创建钱包
            </Button>
          </div>
        ) : (
          <div className={styles.passwordInputContainer}>
            <Input
              placeholder="请输入解锁密码"
              value={inputPassword}
              onChange={(value) => setInputPassword(value)}
              type="password"
              style={{ marginBottom: "16px" }}
            />
            <Button color="primary" onClick={handleGenerateMnemonic}>
              校验密码并创建钱包
            </Button>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
};

export default GenerateMnemonic;
