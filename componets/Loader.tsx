import React from 'react'

const Loader = () => {
  return (
    <div id='loader' className='d-flex justify-content-center align-items-center'>
        <div className="spinner-border text-primary" role='status'>
            <span className='visually-hidden'> Loading...</span>
        </div>
    </div>
  )
}

export default Loader