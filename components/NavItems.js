import React, { useEffect, useState } from 'react'
import { ArrowSmUpIcon } from '@heroicons/react/outline'

const NavItems = ({setcomp}) => {
  const SWAP = 'Swap'
  const AddLiq = 'Add Liquidity'
  const StakeMe = 'StakeMe'
  // const CHART = 'Charts'

  const [selectedNavItem, setSelectedNavItem] = useState(SWAP);

  useEffect(()=>{
    if(selectedNavItem === AddLiq){
      setcomp(true);
    }
    else setcomp(false);
  }, [selectedNavItem]);

  return (
    <div className='bg-zinc-900 h-fit flex items-center justify-around rounded-full mx-6'>
      <p
        className={getNavIconClassName(SWAP)}
        onClick={() => setSelectedNavItem(SWAP)}
      >
        {SWAP}
      </p>
      <p
        className={getNavIconClassName(AddLiq)}
        onClick={() => setSelectedNavItem(AddLiq)}
      >
        {AddLiq}
      </p>
      <p
        className={getNavIconClassName(StakeMe)}
        onClick={() => {
          setSelectedNavItem(StakeMe);
          window.open('https://stakemee.vercel.app/', '_blank');
        }}
      >
        {StakeMe}
      </p>
      {/* <p
        className={getNavIconClassName(CHART)}
        onClick={() => window.open('https://info.uniswap.org/#/', '_blank')}
      >
        {CHART}
        <ArrowSmUpIcon className='h-4 rotate-45' />
      </p> */}
    </div>
  )

  function getNavIconClassName(name) {
    let className =
      'p-1 px-4 cursor-pointer border-[4px] border-transparent flex items-center'
    className +=
      name === selectedNavItem
        ? ' bg-zinc-800 border-zinc-900 rounded-full'
        : ''
    return className
  }
}

export default NavItems
