import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  List,
  Picker,
  PickerView,
  Checkbox,
  Modal,
  Toast,
} from "antd-mobile";
import QRCode from "react-qr-code";
import useWalletStorage, {
  AccountInfo,
  generateUniqueId,
  useProvider,
} from "../../hooks/useWalletStorage";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import styles from "./index.module.less";
import { ethers, HDNodeWallet } from "ethers";

const WalletList: React.FC = () => {
  const { walletList, removeAccount, isSingleAccountWallet, setWalletList } =
    useWalletStorage();
  const navigate = useNavigate();
  const provider = useProvider();
  const [qrVisible, setQrVisible] = useState(false);
  const [ethBalance, setEthBalance] = useState<string>("");
  const [yangBalance, setYangBalance] = useState<string>("");
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(
    localStorage.getItem("selectedWalletId")
  );
  const [selectedAccount, setSelectedAccount] = useState<string | null>(
    localStorage.getItem("selectedAccount")
  );
  const [visible, setVisible] = useState(false);

  const handleCreateAccount = async () => {
    if (selectedWalletId) {
      const wallet = walletList.find(
        (wallet) => wallet.walletId === selectedWalletId
      );
      if (wallet) {
        try {
          // 使用助记词派生新的账户
          const hdNode = HDNodeWallet.fromPhrase(wallet.encryptedMnemonic);
          const newAccountWallet = hdNode.deriveChild(wallet.accounts.length);
          const newAccount: AccountInfo = {
            address: newAccountWallet.address,
          };
          const updatedWalletList = walletList.map((w) =>
            w.walletId === selectedWalletId
              ? { ...w, accounts: [...w.accounts, newAccount] }
              : w
          );
          localStorage.setItem("walletList", JSON.stringify(updatedWalletList));
          setWalletList(updatedWalletList);
        } catch (error) {
          console.error("Error deriving new account:", error);
          Toast.show("创建账户失败");
        }
      }
    }
  };

  useEffect(() => {
    if (selectedWalletId) {
      // 默认选中当前钱包的第一个账户
      const wallet = walletList.find(
        (wallet) => wallet.walletId === selectedWalletId
      );
      if (wallet && wallet.accounts.length > 0) {
        handleSelectAccount(wallet.accounts[0].address);
      }
    }
  }, [selectedWalletId]);

  const handleCreateWallet = () => {
    navigate("/create-wallet");
  };

  const handleImportWallet = () => {
    navigate("/import-wallet");
  };

  const navToSend = () => {
    navigate("/send");
  };

  const handleSelectWallet = (walletId: string) => {
    setSelectedWalletId(walletId);
    // 保存选中的钱包到 localStorage
    localStorage.setItem("selectedWalletId", walletId);
  };

  const handleSelectAccount = async (address: string) => {
    setSelectedAccount(address);
    // 保存选中的账户到 localStorage
    localStorage.setItem("selectedAccount", address);

    const wallet = walletList.find(
      (wallet) => wallet.walletId === selectedWalletId
    );
    if (wallet) {
      try {
        const password = localStorage.getItem("walletUnlockPassword");
        if (!password) {
          Toast.show("未找到解锁密码");
          return;
        }

        // 使用助记词恢复钱包并加密保存
        const hdNode = HDNodeWallet.fromPhrase(wallet.encryptedMnemonic);
        const encryptedJson = await hdNode.encrypt(password);
        localStorage.setItem("encryptedWallet", encryptedJson);
      } catch (error) {
        console.error("Error encrypting wallet:", error);
        Toast.show("加密钱包失败");
      }
    }
    setSelectedAccount(address);
    // 保存选中的账户到 localStorage
    localStorage.setItem("selectedAccount", address);

    try {
      // 查询 ETH 和 YangToken 数量

      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);

      // YangToken合约地址
      const yangContractAddress = "0x5013b19A9502d304F49E5f31Dc34491F4aCAa48d";
      const yangAbi = [
        "function balanceOf(address account) view returns (uint256)",
      ];
      const yangContract = new ethers.Contract(
        yangContractAddress,
        yangAbi,
        provider
      );
      const yangBalance = await yangContract.balanceOf(address);

      // 更新状态以显示余额
      setEthBalance(ethBalance);
      setYangBalance(ethers.formatUnits(yangBalance, 3));
    } catch (error) {
      console.error("Error fetching balances:", error);
      Toast.show("查询余额失败");
    }
    // 保存选中的账户到 localStorage
    localStorage.setItem("selectedAccount", address);
  };

  const handleDeleteAccount = () => {
    if (!selectedWalletId || !selectedAccount) return;

    Modal.confirm({
      content: "确定要删除当前选中的账户吗？",
      onConfirm: () => {
        removeAccount(selectedWalletId, selectedAccount);
        setSelectedAccount(null);
      },
    });
  };

  const handleExportPrivateKey = async () => {
    if (!selectedWalletId) return;
    const wallet = walletList.find(
      (wallet) => wallet.walletId === selectedWalletId
    );
    if (!wallet) return;

    try {
      const password = localStorage.getItem("walletUnlockPassword");
      if (!password) {
        Toast.show("未找到解锁密码");
        return;
      }

      // 使用助记词恢复钱包
      const hdNode = HDNodeWallet.fromPhrase(wallet.encryptedMnemonic);
      const json = await hdNode.encrypt(password);

      // 创建一个 keystore 文件并下载
      const element = document.createElement("a");
      const file = new Blob([json], { type: "application/json" });
      element.href = URL.createObjectURL(file);
      element.download = `keystore-${selectedWalletId}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      Toast.show("私钥已导出");
    } catch (error) {
      console.error("Error exporting private key:", error);
      Toast.show("导出私钥失败");
    }
  };

  const handleDeleteWallet = () => {
    if (!selectedWalletId) return;

    Modal.confirm({
      content: "确定要删除当前选中的钱包吗？",
      onConfirm: () => {
        const updatedWalletList = walletList.filter(
          (wallet) => wallet.walletId !== selectedWalletId
        );
        localStorage.setItem("walletList", JSON.stringify(updatedWalletList));
        setWalletList(updatedWalletList);
        setSelectedWalletId(null);
        setSelectedAccount(null);
        Toast.show("钱包已删除");
      },
    });
  };

  const handleReceive = () => {
    if (!selectedAccount) {
      Toast.show("请选择一个账户");
      return;
    }
    setQrVisible(true);
  };

  return (
    <ResponsiveContainer>
      {walletList.length > 0 ? (
        <>
          <Button onClick={() => setVisible(true)}>
            {selectedWalletId
              ? `已选择: Wallet ID ${selectedWalletId}`
              : "请选择一个钱包"}
          </Button>
          <Picker
            columns={[
              walletList.map((wallet) => ({
                label: `Wallet ID: ${wallet.walletId}`,
                value: wallet.walletId,
              })),
            ]}
            visible={visible}
            onClose={() => setVisible(false)}
            onConfirm={(value) => {
              handleSelectWallet(value[0] as any);
              setVisible(false);
            }}
          />
          {selectedWalletId && (
            <List header="Accounts">
              {walletList
                .find((wallet) => wallet.walletId === selectedWalletId)
                ?.accounts.map((account, index) => (
                  <List.Item
                    key={index}
                    prefix={
                      <Checkbox
                        checked={selectedAccount === account.address}
                        onChange={() => handleSelectAccount(account.address)}
                      />
                    }
                  >
                    <span className={styles.address}>
                      Address: {account.address}
                    </span>
                  </List.Item>
                ))}
            </List>
          )}
          <div className="walletInfo">
            {selectedAccount && (
              <div className={styles.balanceInfo}>
                <p>ETH Balance: {ethBalance} ETH</p>
                <p>YangToken Balance: {yangBalance} Yang</p>
              </div>
            )}
          </div>
          <div className={styles.createWalletButtonBottom}>
            <Button color="primary" onClick={handleCreateWallet}>
              创建钱包
            </Button>
            <Button color="primary" onClick={handleCreateAccount}>
              创建账户
            </Button>
            <Button color="default" onClick={handleImportWallet}>
              导入钱包
            </Button>
            {/* </div> */}
            {/* <div className={styles.additionalButtons}> */}
            <Button
              color="danger"
              onClick={handleDeleteAccount}
              style={{ marginTop: "16px" }}
              disabled={isSingleAccountWallet(selectedWalletId || "")}
            >
              删除账户
            </Button>
            <Button
              color="danger"
              onClick={() => {
                /* 删除钱包逻辑 */
                handleDeleteWallet();
              }}
              style={{ marginTop: "16px" }}
            >
              删除钱包
            </Button>
            <Button
              color="default"
              onClick={() => {
                /* 导出私钥逻辑，考虑 walletUnlockPassword 影响 */
                handleExportPrivateKey();
              }}
              style={{ marginTop: "16px" }}
            >
              导出私钥
            </Button>
            <Button
              color="default"
              onClick={() => {
                /* 导出私钥逻辑，考虑 walletUnlockPassword 影响 */
                navToSend();
              }}
              style={{ marginTop: "16px" }}
            >
              发送
            </Button>
            <Button
              color="default"
              onClick={handleReceive}
              style={{ marginTop: "16px" }}
            >
              接收
            </Button>
          </div>
          <Modal
            visible={qrVisible}
            onClose={() => setQrVisible(false)}
            title="接收二维码"
            closeOnMaskClick={true}
            content={
              <div>
                {selectedAccount && (
                  <QRCode value={selectedAccount} size={200} />
                )}
              </div>
            }
          ></Modal>
        </>
      ) : (
        <div className={styles.createWalletContainer}>
          <Button color="primary" onClick={handleCreateWallet}>
            创建钱包
          </Button>
          <Button
            color="default"
            onClick={handleImportWallet}
            style={{ marginTop: "16px" }}
          >
            导入已有钱包
          </Button>
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default WalletList;
