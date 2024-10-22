
import React from 'react';
import { useTotalSupply } from '../../hooks';
import { useWalletContext } from '../../context/walletContext';

const TotalSupply: React.FC = () => {
  const totalSupply = useTotalSupply();
  const { account } = useWalletContext();

  return (
    <div>
      {account ? (
        <p>Total Supply: {totalSupply ? `${totalSupply} Tokens` : 'Loading...'}</p>
      ) : (
        <p>Please connect your wallet to see the total supply</p>
      )}
    </div>
  );
};

export default TotalSupply;