import { ethers } from 'ethers'
import CustomDexABI from '../utils/CryptoSwap.json'
import CustomTokenABI from '../utils/CustomToken.json';
import { cryptoswapAddress } from '../config';

export const tokenContract = async (address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const { ethereum } = window
  if (ethereum) {
    const signer = provider.getSigner()
    
    const contractReader = new ethers.Contract(address, CustomTokenABI.abi, signer)

    return contractReader
  }
}

export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const { ethereum } = window

  if (ethereum) {
    const signer = provider.getSigner()

    const contractReader = new ethers.Contract(
      cryptoswapAddress,
      CustomDexABI.abi,
      signer,
    )

    return contractReader
  }
}
