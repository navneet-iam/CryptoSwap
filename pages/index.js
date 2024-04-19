import Footer from '../components/Footer'
import Header from '../components/Header'
import SwapComponent from '../components/SwapComponent'

export default function Home() {
  return (
    <div className='w-full h-screen flex flex-col lrpos justify-center ethbg'>
      <Header />
      <SwapComponent />
      {/* <Footer /> */}
    </div>
  )
}
