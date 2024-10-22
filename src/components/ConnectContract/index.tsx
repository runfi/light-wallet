import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useWalletContext } from '../../context/walletContext';

const ConnectContract: React.FC = () => {
  const { contractAddress, setContractAddress } = useWalletContext();
  const [inputAddress, setInputAddress] = useState(contractAddress);

  const handleSetAddress = () => {
    setContractAddress(inputAddress);
  };

  return (
    <div>
      <Input
        placeholder="Enter Contract Address"
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Button type="primary" onClick={handleSetAddress}>
        Set Contract Address
      </Button>
    </div>
  );
};

export default ConnectContract;