import React from "react";
import { Button } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import styles from "./index.module.less";

const CreateWallet: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToGenerateMnemonic = () => {
    navigate("/generate-mnemonic");
  };

  const handleImportWallet = () => {
    // 导入已有钱包的逻辑
    navigate("/import-wallet");
  };

  return (
    <ResponsiveContainer>
      <div className={styles.createWalletPage}>
        <Button
          color="primary"
          onClick={handleNavigateToGenerateMnemonic}
          style={{ marginBottom: "16px" }}
        >
          创建新钱包
        </Button>
        <Button color="default" onClick={handleImportWallet}>
          导入已有钱包
        </Button>
      </div>
    </ResponsiveContainer>
  );
};

export default CreateWallet;
