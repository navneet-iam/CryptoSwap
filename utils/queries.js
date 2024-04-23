import { BigNumber, ethers } from 'ethers'
import { contract, tokenContract } from './contract'
import { toEth } from './ether-utils'
import { cryptoswapAddress } from '../config';

export async function swapEthToToken(tokenName, amount) {
  try {
    let tx = { value: toWei(amount) }
    console.log("ethToTOken", amount, tx);
    const contractObj = await contract()
    const data = await contractObj.swapEthToToken(tokenName, tx)

    const receipt = await data.wait()
    return receipt
  } catch (e) {
    return parseErrorMsg(e)
  }
}

export async function hasValidAllowance(owner, tokenName, amount) {
  try {
    const contractObj = await contract()
    const address = await contractObj.getTokenAddress(tokenName)

    const tokenContractObj = await tokenContract(address)
    const data = await tokenContractObj.allowance(
      owner,
      cryptoswapAddress,
    )

    const result = BigNumber.from(data.toString()).gte(
      BigNumber.from(toWei(amount)),
    )

    return result
  } catch (e) {
    return parseErrorMsg(e)
  }
}

export async function swapTokenToEth(tokenName, amount) {
  try {
    const contractObj = await contract();
    console.log("ethToTOken", amount, toWei(amount));
    const data = await contractObj.swapTokenToEth(tokenName, toWei(amount))

    const receipt = await data.wait()
    return receipt
  } catch (e) {
    return parseErrorMsg(e)
  }
}

export async function addLiquidity(srcToken, destToken, amount1, amount2) {
  try {
    const contractObj = await contract()

    const data = await contractObj.addLiquidity(
      srcToken,
      destToken,
      toWei(amount1),
      toWei(amount2),
    )
    console.log("done ", data);
    const receipt = await data.wait()
    return receipt
  } catch (e) {
    return parseErrorMsg(e)
  }
}

export async function swapTokenToToken(srcToken, destToken, amount) {
  try {
    const contractObj = await contract()
    console.log("check", srcToken, destToken, amount, toWei(amount));

    const data = await contractObj.swapTokens(
      srcToken,
      destToken,
      toWei(amount),
    )
    console.log("done ", data);
    const receipt = await data.wait()
    return receipt
  } catch (e) {
    return parseErrorMsg(e)
  }
}

export async function getRate(srcToken, destToken){
  try {
    const contractObj = await contract()

    const rateData = await contractObj.getAmountOut(srcToken, destToken, toWei(1));

    const result = parseFloat(ethers.utils.formatEther(rateData)).toFixed(4);
    console.log("rate", result);

    return result;
  } catch (error) {
    return parseErrorMsg(error)
  }
}

export async function getTokenBalance(tokenName, address) {
  const contractObj = await contract()
  const balance = contractObj.getBalance(tokenName, address)
  return balance
}

export async function getTokenAddress(tokenName) {
  try {
    const contractObj = await contract()
    const address = await contractObj.getTokenAddress(tokenName)
    return address
  } catch (e) {
    return parseErrorMsg(e)
  }
}

export async function increaseAllowance(tokenName, amount) {
  try {
    const contractObj = await contract()
    const address = await contractObj.getTokenAddress(tokenName)

    const tokenContractObj = await tokenContract(address)
    const data = await tokenContractObj.approve(
      cryptoswapAddress,
      toWei(amount),
    )

    const receipt = await data.wait()
    return receipt
  } catch (e) {
    return parseErrorMsg(e)
  }
}

function toWei(amount) {
  const toWei = ethers.utils.parseUnits(amount.toString())
  return toWei.toString()
}

function parseErrorMsg(e) {
  const json = JSON.parse(JSON.stringify(e))
  return json?.reason || json?.error?.message
}
