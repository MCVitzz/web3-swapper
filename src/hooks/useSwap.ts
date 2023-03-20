import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolArtifact from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { Pool } from "@uniswap/v3-sdk";
import { ethers, type BigNumber } from "ethers";
import { goerli, useAccount, useContract, useProvider } from "wagmi";
import useToast from "./useToast";
import useToken from "./useToken";

export interface Immutables {
  token0: string;
  token1: string;
  fee: number;
}

export interface State {
  liquidity: BigNumber;
  tick: number;
  sqrtPriceX96: BigNumber;
}

// WETH - UNI pool with 0.3% fee
const POOL_ADDRESS = "0x07A4f63f643fE39261140DF5E613b9469eccEC86";

const WETH_DECIMALS = 18;
const UNI_DECIMALS = 18;

const ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const useSwap = () => {
  const { open } = useToast();
  const provider = useProvider();
  const { approve, deposit } = useToken("WETH");
  const { address } = useAccount();
  const poolContract = useContract({
    address: POOL_ADDRESS,
    abi: IUniswapV3PoolArtifact.abi,
    signerOrProvider: provider,
  });

  const getPoolImmutables = async () => {
    if (!poolContract)
      throw new Error("Pool contract has not been initialized");

    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
    ]);

    const immutables: Immutables = {
      token0,
      token1,
      fee,
    };
    return immutables;
  };

  const getPoolState = async () => {
    if (!poolContract)
      throw new Error("Pool contract has not been initialized");

    const [liquidity, slot] = await Promise.all([
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    const PoolState: State = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
    };

    return PoolState;
  };

  const getQuote = async (amount: number) => {
    const [immutables, state] = await Promise.all([
      getPoolImmutables(),
      getPoolState(),
    ]);

    const tokenA = new Token(goerli.id, immutables.token0, UNI_DECIMALS);
    const tokenB = new Token(goerli.id, immutables.token1, WETH_DECIMALS);

    const pool = new Pool(
      tokenA,
      tokenB,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick
    );

    const outputAmount = amount * parseFloat(pool.token1Price.toFixed(2));

    return outputAmount;
  };

  const swap = async (amount: number) => {
    try {
      if (!poolContract)
        throw new Error("Router contract has not been initialized");

      await deposit(amount);
      await approve(ROUTER_ADDRESS, amount);

      const immutables = await getPoolImmutables();

      const parsedAmount = ethers.utils.parseUnits(
        amount.toString(),
        UNI_DECIMALS
      );

      const params = {
        tokenIn: immutables.token1,
        tokenOut: immutables.token0,
        fee: immutables.fee,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
        amountIn: parsedAmount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      };

      const txn = await poolContract.exactInputSingle(params, {
        gasLimit: ethers.utils.hexlify(700000),
      });

      return txn;
    } catch (err) {
      open({
        children: "Something went wrong.",
        type: "error",
      });
      return false;
    }
  };

  return { getQuote, swap };
};

export default useSwap;
