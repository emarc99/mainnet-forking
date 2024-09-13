import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");
async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const LSK = "0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f";
    const LIQUIDITY_RECEIVER = "0x9ce826910f5e22A6e22A6a0418033b2677505752";
    const TOKEN_HOLDER = "0x28C6c06298d514Db089934071355E5743bf21d60";

    const DESIRED_USD = ethers.parseUnits("100", 6);
    const DESIRED_LSK = ethers.parseUnits("40", 18);
    const MIN_USD = ethers.parseUnits("60", 6);
    const MIN_LSK = ethers.parseUnits("10", 18);

    const deadline = Math.floor(Date.now() / 1000) + 60 * 15; //15 Minutes in UNIX Timestamp

    // 211347504,428153
    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS);
    const USDT_Contract = await ethers.getContractAt("IERC20", USDT, impersonatedSigner);
    const LSK_Contract = await ethers.getContractAt("IERC20", LSK, impersonatedSigner);

    const TOKEN_HOLDER_USDT_BAL_BEFORE = await USDT_Contract.balanceOf(TOKEN_HOLDER);
    const TOKEN_HOLDER_LSK_BAL_BEFORE = await LSK_Contract.balanceOf(TOKEN_HOLDER);

    console.log("=============================================")
    console.log("USDT balance before swap", Number(TOKEN_HOLDER_USDT_BAL_BEFORE));
    console.log("LSK balance before swap", Number(TOKEN_HOLDER_LSK_BAL_BEFORE));
    console.log("=============================================")

    await USDT_Contract.approve(ROUTER, DESIRED_USD);
    await LSK_Contract.approve(ROUTER, DESIRED_LSK);

    await ROUTER.addLiquidity(USDT, LSK, DESIRED_USD, DESIRED_LSK, MIN_USD, MIN_LSK, LIQUIDITY_RECEIVER, deadline); // ROUTER.addLiquidity

    const TOKEN_HOLDER_USDT_BAL_AFTER = await USDT_Contract.balanceOf(TOKEN_HOLDER);
    const TOKEN_HOLDER_LSK_BAL_AFTER = await LSK_Contract.balanceOf(TOKEN_HOLDER);
    console.log("=============================================")
    console.log("USDT balance after swap", Number(TOKEN_HOLDER_USDT_BAL_AFTER));
    console.log("LSK balance after swap", Number(TOKEN_HOLDER_LSK_BAL_AFTER));
    console.log("=============================================")
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })