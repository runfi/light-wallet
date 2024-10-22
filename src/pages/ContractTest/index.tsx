import React from 'react';
import ConnectWallet from '../../components/ConnectWallet';
import TokenBalance from '../../components/TokenBalance';
import TransferToken from '../../components/TransferToken';
import TotalSupply from '../../components/TotalSupply';
import { Layout, Typography } from 'antd';
import abi from '../../abi/YangTokenABI.json';
import ConnectContract from '../../components/ConnectContract';
import { WalletProvider } from '../../context/walletContext';


const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <WalletProvider>
      <Layout>
        <Header>
          <Title level={2} style={{ color: 'white', textAlign: 'center' }}>
            YangToken DApp
          </Title>
        </Header>
        <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <ConnectWallet />
          <ConnectContract />
          <TokenBalance />
          <TransferToken />
          <TotalSupply/>
        </Content>
      </Layout>
    </WalletProvider>
  );
};

export default App;
