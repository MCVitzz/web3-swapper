import { ethers } from "ethers";
import { useSigner, useContract } from "wagmi";
import WETHArtifact from "../abis/WETH.json";

type TokenProps = {
  abi: typeof WETHArtifact.abi;
  decimals: number;
  address: `0x${string}`;
};

export type Token = "WETH";

const getTokenAddress = (token: Token) => {
  switch (token) {
    case "WETH":
      return "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6" as const;
    default:
      throw new Error("Token not supported");
  }
};

const getTokenAbi = (token: Token) => {
  switch (token) {
    case "WETH":
      return WETHArtifact.abi;
    default:
      throw new Error("Token not supported");
  }
};

const getTokenProps = (token: Token): TokenProps => {
  switch (token) {
    case "WETH":
      return {
        abi: getTokenAbi(token),
        decimals: 18,
        address: getTokenAddress(token),
      };
    default:
      throw new Error("Token not supported");
  }
};

const useToken = (token: Token) => {
  const { data: signer } = useSigner();
  const { address, abi, decimals } = getTokenProps(token);
  const contract = useContract({
    address,
    abi,
    signerOrProvider: signer,
  });

  const deposit = async (amount: number) => {
    if (!contract) throw new Error("WETH contract has not been initialized");

    const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

    const txn = await contract.deposit({ value: parsedAmount });
    return txn;
  };
  const approve = async (address: string, amount: number) => {
    if (!contract) throw new Error("WETH contract has not been initialized");

    const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);

    const txn = contract.approve(address, parsedAmount);
    return txn;
  };

  return { deposit, approve };
};

export default useToken;
