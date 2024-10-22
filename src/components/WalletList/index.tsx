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
import useWalletStorage, {
  AccountInfo,
  generateUniqueId,
} from "../../hooks/useWalletStorage";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import styles from "./index.module.less";
import { ethers, HDNodeWallet } from "ethers";

const WalletList: React.FC = () => {
  const { walletList, removeAccount, isSingleAccountWallet, setWalletList } =
    useWalletStorage();
  const navigate = useNavigate();
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
          const newAccountWallet = HDNodeWallet.fromPhrase(
            wallet.encryptedMnemonic
          ).derivePath(`m/44'/60'/0'/0/${wallet.accounts.length}`);
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

  const handleSelectWallet = (walletId: string) => {
    setSelectedWalletId(walletId);
    // 保存选中的钱包到 localStorage
    localStorage.setItem("selectedWalletId", walletId);
  };

  const handleSelectAccount = (address: string) => {
    setSelectedAccount(address);
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

  return (
    <ResponsiveContainer>
      {walletList.length > 0 ? (
        <div className={styles.walletListContainer}>
          <Button
            onClick={() => setVisible(true)}
            className={styles.selectWalletButton}
          >
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
            <List header="Accounts" className={styles.accountList}>
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
                    className={styles.accountItem}
                  >
                    <span className={styles.address}>
                      Address: {account.address}
                    </span>
                  </List.Item>
                ))}
            </List>
          )}
          <div className={styles.createWalletButtonBottom}>
            <Button
              color="primary"
              onClick={handleCreateWallet}
              className={styles.createWalletButton}
            >
              创建钱包
            </Button>
            <Button
              color="primary"
              onClick={handleCreateAccount}
              className={styles.createAccountButton}
              style={{ marginLeft: "16px" }}
            >
              创建账户
            </Button>
            <Button
              color="default"
              onClick={handleImportWallet}
              className={styles.importWalletButton}
              style={{ marginTop: "16px" }}
            >
              导入已有钱包
            </Button>
          </div>
          <div className={styles.additionalButtons}>
            <Button
              color="danger"
              onClick={handleDeleteAccount}
              className={styles.deleteAccountButton}
              style={{ marginTop: "16px" }}
              disabled={isSingleAccountWallet(selectedWalletId || "")}
            >
              删除账户
            </Button>
            <Button
              color="danger"
              onClick={() => {
                /* 删除钱包逻辑 */
              }}
              className={styles.deleteWalletButton}
              style={{ marginTop: "16px" }}
            >
              删除钱包
            </Button>
            <Button
              color="default"
              onClick={() => {
                /* 导出私钥逻辑，考虑 walletUnlockPassword 影响 */
              }}
              className={styles.exportPrivateKeyButton}
              style={{ marginTop: "16px" }}
            >
              导出私钥
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.createWalletContainer}>
          <Button
            color="primary"
            onClick={handleCreateWallet}
            className={styles.createWalletButton}
          >
            创建钱包
          </Button>
          <Button
            color="default"
            onClick={handleImportWallet}
            className={styles.importWalletButton}
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
