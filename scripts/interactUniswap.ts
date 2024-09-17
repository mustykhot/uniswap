import { ethers } from "hardhat";
import { Contract } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const UNISWAP_V2_ROUTER_ADDRESS = "0x2A95B9242EA682DF14FB4d0bf6cba42D2ED63E18";

const UNISWAP_ROUTER_ABI = [
  // The ABI of the functions you want to interact with
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
];

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Interacting with the Uniswap V2 Router using account:",
    deployer.address
  );

  const router: Contract = new ethers.Contract(
    UNISWAP_V2_ROUTER_ADDRESS,
    UNISWAP_ROUTER_ABI,
    deployer
  );

  const path = ["0xc778417E063141139Fce010982780140Aa0cD5Ab", "0xTokenAddress"]; // ETH -> Token
  const amountIn = ethers.utils.parseEther("1");
  const amountsOut = await router.getAmountsOut(amountIn, path);
  console.log(`For 1 ETH, you will get: ${amountsOut[1].toString()} tokens`);

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const amountOutMin = ethers.utils.parseUnits("0.1", 18);

  const tx = await router.swapExactETHForTokens(
    amountOutMin,
    path,
    deployer.address,
    deadline,
    { value: ethers.utils.parseEther("0.1") }
  );
  await tx.wait();
  console.log("Swap transaction complete:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
