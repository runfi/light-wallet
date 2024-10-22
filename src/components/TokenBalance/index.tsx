import React from 'react';
import { useBalance } from '../../hooks';
import { useWalletContext } from '../../context/walletContext';
import { Button, Flex } from 'antd';

const TokenBalance: React.FC = () => {
  const { balance, fetchBalance } = useBalance();
  const { account } = useWalletContext();

  return (
    <div>
      {account ? (
        <Flex wrap gap="small" align='center' style={{margin: '20px 0 '}}>
          <div>Token Balance: {balance ? `${balance} Tokens` : 'Loading...'}</div>
          <Button onClick={fetchBalance} style={{ marginTop: '1rem' }}>Refresh Balance</Button>
        </Flex>
      ) : (
        <p>Please connect your wallet to see the token balance</p>
      )}
    </div>
  );
};

export default TokenBalance;