"use client";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";

import { goerli } from "@wagmi/core/chains";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { optimismGoerli } from "@wagmi/core/chains";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimismGoerli],
  [
    alchemyProvider({ apiKey: "5_ocm9TVKXIasmSK15B55FCI_hYMyH5F" }),
    publicProvider(),
  ]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "bWallet",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "7a99dce825d9493a1453dd01dbca4ca3",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export default function WagmiProvider({ children }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
