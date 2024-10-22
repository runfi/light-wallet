import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContractTest from "./pages/ContractTest";
import Wallet from "./pages/Wallet";
import CreateWallet from "./pages/CreateWallet";
import GenerateMnemonic from "./pages/GenerateMnemonic";
import ShowMnemonic from "./pages/ShowMnemonic";
import ImportWallet from "./pages/ImportWallet";
import Send from "./pages/Send";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Wallet />} />
        <Route path="/contract" element={<ContractTest />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/generate-mnemonic" element={<GenerateMnemonic />} />
        <Route path="/show-mnemonic" element={<ShowMnemonic />} />
        <Route path="/import-wallet" element={<ImportWallet />} />
        <Route path="/send" element={<Send />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
