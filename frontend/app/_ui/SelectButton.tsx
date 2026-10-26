import React from 'react'

const SelectButton = ({
    onClickHandler,
    contentButton
} : {
    onClickHandler: () => void,
    contentButton: string
}) => {
  return (
    <div className='w-full h-full'>
        <button className='' onClick={onClickHandler}>{contentButton}</button>
    </div>
  )
}

export default SelectButton