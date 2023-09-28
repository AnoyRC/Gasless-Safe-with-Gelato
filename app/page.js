"use client";
import {
  useAccount,
  useConnect,
  useContractRead,
  useWalletClient,
} from "wagmi";
import SafeABI from "@/constants/safe.abi";
import { toAddress } from "@yearn-finance/web-lib/utils/address";
import { generateArgInitializers } from "@/utils/ArgInitializer";
import { ethers } from "ethers";
import { useEthersProvider } from "@/Providers/EthersProvider";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";

export default function Home() {
  const { connectors, connectAsync } = useConnect();
  const { address } = useAccount();
  const signer = useEthersProvider();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const relay = new GelatoRelay();
  // const { data, isError, isLoading } = useContractRead({
  //   address: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
  //   abi: SafeABI,
  //   functionName: "createProxyWithNonce",
  //   args: [
  //     toAddress("0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"),
  //     generateArgInitializers(
  //       [
  //         "0x3C700d88616C9e186aed7dd59B2e7f60819bf863",
  //         "0x01545d12C90464B7075d58952Cad5923a5be0860",
  //       ],
  //       2
  //     ),
  //     BigInt(1),
  //   ],
  // });

  const createSafe = async () => {
    const RPC_URL = "https://optimism-goerli.publicnode.com";
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const safe = new ethers.Contract(
      "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
      SafeABI,
      walletClient
    );

    console.log(walletClient);

    const argInitializer = generateArgInitializers(
      [address, "0x01545d12C90464B7075d58952Cad5923a5be0860"],
      2
    );

    const { data } = await safe.createProxyWithNonce.populateTransaction(
      toAddress("0xfb1bffC9d739B8D520DaF37dF666da4C687191EA"),
      `0x${argInitializer}`,
      BigInt(3)
    );

    console.log(data);

    // Populate a relay request
    const request = {
      chainId: 420,
      target: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
      data: data,
    };

    const relayResponse = await relay.sponsoredCall(
      request,
      "Y5xXf5asu4sjWKDKZAePR6yqpHdC0nOWSzQhlYIk1fw_"
    );

    console.log(relayResponse);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        className="bg-red-500 p-3 rounded-lg"
        onClick={async () => {
          await connectAsync({ connector: connectors[0] });
        }}
      >
        Connect
      </button>

      <h1 className="text-4xl font-bold text-center">{address}</h1>

      <button
        className="bg-red-500 p-3 rounded-lg"
        onClick={() => {
          createSafe();
        }}
      >
        Create Safe
      </button>
    </main>
  );
}
