import React, { useEffect, useState, useRef } from 'react'
import {
  getRate,
  hasValidAllowance,
  increaseAllowance,
  addLiquidity,
} from '../utils/queries'

import { CogIcon } from '@heroicons/react/outline'
import SwapField from './SwapField'
import TransactionStatus from './TransactionStatus'
import toast, { Toaster } from 'react-hot-toast'
import { toEth, toWei } from '../utils/ether-utils'
import { useAccount } from 'wagmi'

const LiquidityComponent = () => {
  const [srcToken, setSrcToken] = useState("CoinA")
  const [destToken, setDestToken] = useState("CoinB")
    const [pool, setPool] = useState("pool1");
  const [inputValue, setInputValue] = useState()
  const [outputValue, setOutputValue] = useState()

  const inputValueRef = useRef()
  const outputValueRef = useRef()

  const isReversed = useRef(false)

  const INCREASE_ALLOWANCE = 'Increase allowance'
  const ENTER_AMOUNT = 'Enter an amount'
  const CONNECT_WALLET = 'Connect wallet'
  const SWAP = 'ADD'

  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT)
  const [txPending, setTxPending] = useState(false)
  const [exchgRate, setExchgRate] = useState(1);

  const notifyError = msg => toast.error(msg, { duration: 6000 })
  const notifySuccess = () => toast.success('Transaction completed.')

  const { address } = useAccount()

  useEffect(() => {
    // Handling the text of the submit button

    if (!address) setSwapBtnText(CONNECT_WALLET)
    else if (!inputValue || !outputValue) setSwapBtnText(ENTER_AMOUNT)
    else setSwapBtnText(SWAP)
  }, [inputValue, outputValue, address])

  useEffect(() => {
    if (
      document.activeElement !== outputValueRef.current &&
      document.activeElement.ariaLabel !== 'srcToken' &&
      !isReversed.current
    )
      populateOutputValue(inputValue)

    if (inputValue?.length === 0) setOutputValue('')
  }, [inputValue, destToken])

  const getExrate = async() =>{
      const res = await getRate(srcToken, destToken);
      setExchgRate(res);
  }

  useEffect(()=>{
    getExrate();
  }, [srcToken, destToken]);

  useEffect(() => {
    if (
      document.activeElement !== inputValueRef.current &&
      document.activeElement.ariaLabel !== 'destToken' &&
      !isReversed.current
    )
      populateInputValue(outputValue)

    if (outputValue?.length === 0) setInputValue('')
  }, [outputValue, srcToken])

  const [value, setValue] = useState('')

  return (
    <>
    <div className='bg-zinc-900 w-[35%] p-4 px-6 mgr rounded-xl'>
      <div className='flex items-center justify-between py-4 px-1'>
        <p>Add Liquidity</p>
        <CogIcon className='h-6' />
      </div>
      <div className='bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600 flex items-center'>
        {/* {destTokenComp} */}
        <input
        ref={inputValueRef}
        className='w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent'
        type={'number'}
        value={inputValue}
        placeholder={'0.0'}
        onChange={e => {
          setInputValue(e.target.value)
        }}
      />
        CoinA
      </div>

      <div className='bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600 flex items-center'>
        {/* {destTokenComp} */}
        <input
        ref={outputValueRef}
        className='w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent'
        type={'number'}
        value={outputValue}
        placeholder={'0.0'}
        onChange={e => {
          setOutputValue(e.target.value)
        }}
      />
        CoinB
      </div>

      <button
        className={getSwapBtnClassName()}
        onClick={() => {
          if (swapBtnText === INCREASE_ALLOWANCE) handleIncreaseAllowance()
          else if (swapBtnText === SWAP) handleSwap()
        }}
      >
        {swapBtnText}
      </button>

      {txPending && <TransactionStatus />}

      <Toaster />
    </div>
    <div className='bg-zinc-900 w-[35%] p-4 px-6 mgr rounded-xl mt-5'>
    <p>Available pools</p>
    <div className='flex flex-wrap justify-evenly'>
    <button
        className="p-4  my-2 rounded-xl bg-zinc-800"
        onClick={() => {}}
      >
        CoinA/CoinB
      </button>
    <button
        className="p-4 my-2 rounded-xl bg-zinc-800"
        onClick={() => {}}
      >
        CoinB/CoinC
      </button>
    <button
        className="p-4  my-2 rounded-xl bg-zinc-800"
        onClick={() => {}}
      >
        CoinA/CoinC
      </button>
      </div>
        </div>
      </>
  )

  async function handleSwap() {

      // Check whether there is allowance when the swap deals with tokenToEth/tokenToToken
      setTxPending(true)
      const result1 = await hasValidAllowance(address, srcToken, inputValue)
      setTxPending(false)
      setTxPending(true)
      const result2 = await hasValidAllowance(address, destToken, outputValue)
      setTxPending(false)

      if (result1 && result2) performSwap()
      else handleInsufficientAllowance(result1, result2)

  }

  async function handleIncreaseAllowance(result1, result2) {
    // Increase the allowance
    console.log("clicked");
    if(!result1){
        setTxPending(true)
        await increaseAllowance(srcToken, inputValue);
        setTxPending(false)
    }

    if(!result2){
        setTxPending(true)
        await increaseAllowance(destToken, outputValue);
        setTxPending(false)
    }

    // Set the swapbtn to "Swap" again
    setSwapBtnText(SWAP)
  }

  function handleReverseExchange(e) {
    // Setting the isReversed value to prevent the input/output values
    // being calculated in their respective side - effects
    isReversed.current = true

    // 1. Swap tokens (srcToken <-> destToken)
    // 2. Swap values (inputValue <-> outputValue)

    setInputValue(outputValue)
    setOutputValue(inputValue)

    setSrcToken(destToken)
    setDestToken(srcToken)
  }

  function getSwapBtnClassName() {
    let className = 'p-4 w-full my-2 rounded-xl'
    className +=
      swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET
        ? ' text-zinc-400 bg-zinc-800 pointer-events-none'
        : ' bg-blue-700'
    className += swapBtnText === INCREASE_ALLOWANCE ? ' bg-yellow-600' : ''
    return className
  }

  function populateOutputValue() {
    if (
      !inputValue
    )
      return
    console.log("setout", inputValue, exchgRate);
    try {
      setOutputValue((inputValue*exchgRate).toFixed(4))
    } catch (error) {
      setOutputValue('0')
    }
  }

  function populateInputValue() {
    if (
      !outputValue
    )
      return

    try {
      setInputValue((outputValue/exchgRate).toFixed(4))
    } catch (error) {
      setInputValue('0')
    }
  }

  async function performSwap() {
    setTxPending(true)

    let receipt;

    receipt = await addLiquidity(srcToken, destToken, inputValue, outputValue);

    setTxPending(false)
    console.log("data", receipt);
    if (receipt && !receipt.hasOwnProperty('transactionHash'))
      notifyError(receipt)
    else notifySuccess()
  }

  function handleInsufficientAllowance() {
    notifyError(
      "Insufficient allowance. Click 'Increase allowance' to increase it.",
    )
    setSwapBtnText(INCREASE_ALLOWANCE)
  }
}

export default LiquidityComponent
