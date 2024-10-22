import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Toast } from "antd-mobile";
import ResponsiveContainer from "../../components/ResponsiveContainer";
import styles from "./index.module.less";

const ShowMnemonic: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mnemonic } = location.state as { mnemonic: string };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic).then(
      () => Toast.show("助记词已复制"),
      () => Toast.show("复制失败")
    );
  };

  const handleReturnToWalletList = () => {
    navigate("/");
  };

  return (
    <ResponsiveContainer>
      <div className={styles.showMnemonicPage}>
        <p>助记词：</p>
        <p className={styles.mnemonic}>{mnemonic}</p>
        <Button
          color="primary"
          onClick={handleCopyMnemonic}
          style={{ marginBottom: "16px" }}
        >
          复制助记词
        </Button>
        <Button color="default" onClick={handleReturnToWalletList}>
          返回钱包列表
        </Button>
      </div>
    </ResponsiveContainer>
  );
};

export default ShowMnemonic;
