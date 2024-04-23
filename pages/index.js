import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SwapComponent from '../components/SwapComponent'
import LiquidityComponent from '../components/LiquidityComponent';

export default function Home() {
  const [comp, setcomp] = useState(false);
  return (
    <div className='w-full h-screen flex flex-col lrpos justify-center ethbg'>
      <Header setcomp={setcomp}/>
      {
        comp ?
        <LiquidityComponent />
        :
        <SwapComponent />
      }
      {/* <Footer /> */}
    </div>
  )
}
