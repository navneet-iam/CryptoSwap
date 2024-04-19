import React from 'react'
import Selector from './Selector'

const SwapField = ({ obj }, ref) => {
  const { id, value = '', setValue, defaultValue, setToken, ignoreValue } = obj

  return (
    <div className='flex items-center rounded-xl'>
      <input
        ref={ref}
        className='w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent'
        type={'number'}
        value={value}
        placeholder={'0.0'}
        onChange={e => {
          setValue(e.target.value)
        }}
      />

      <Selector
        id={id}
        setToken={setToken}
        defaultValue={defaultValue}
        ignoreValue={ignoreValue}
      />
    </div>
  )
};

export default React.forwardRef(SwapField);
