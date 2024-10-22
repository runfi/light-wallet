import React from 'react';
import { Button } from 'antd';
import { useWalletContext } from '../../context/walletContext';

const ConnectWallet: React.FC = () => {
  const { account, connectWallet, disconnectWallet } = useWalletContext();

  return (
    <div>
      {account ? (
        <div>
          <p>Connected account: {account}</p>
          <Button onClick={disconnectWallet}>Disconnect Wallet</Button>
        </div>
      ) : (
        <Button type="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;