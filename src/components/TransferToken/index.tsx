import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useTransferToken } from '../../hooks';

const TransferToken: React.FC = () => {
  const transferToken = useTransferToken();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    if (toAddress && amount) {
      transferToken(toAddress, amount);
    }
  };

  return (
    <div>
      <Input
        placeholder="Recipient Address"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Input
        placeholder="Amount to Transfer"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button type="primary" onClick={handleTransfer}>
        Transfer Tokens
      </Button>
    </div>
  );
};

export default TransferToken;
