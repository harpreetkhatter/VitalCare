import React from 'react'
import { PricingTable } from '@clerk/nextjs'

const Billing = () => {
  return (
    <div className='px-10 md:px-24 lg:px-48 py-10'>
      <h2 className='font-bold text-3xl mb-10 text-center'>Join Subscription</h2>
      <div> <PricingTable /></div>
    </div>
  )
}

export default Billing