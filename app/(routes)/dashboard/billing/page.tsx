"use client"
import React from 'react'
import { PricingTable } from '@clerk/nextjs'

const Billing = () => {
  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header */}
      <div className='text-center space-y-3'>
        <h1 className='text-4xl font-bold text-gray-900'>Choose Your Plan</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Select the perfect plan for your healthcare needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Clerk Pricing Table - This handles all the subscription logic */}
      <div className='clerk-pricing-wrapper'>
        <PricingTable />
      </div>

      <style jsx global>{`
        .clerk-pricing-wrapper {
          /* Hide Clerk's default styling and use our custom cards */
        }
        
        /* Customize Clerk pricing table to match our design */
        .cl-pricingTable {
          max-width: 100% !important;
        }
        
        .cl-pricingTable__card {
          border-radius: 1.5rem !important;
          border: 2px solid #e5e7eb !important;
          padding: 2rem !important;
          transition: all 0.3s ease !important;
        }
        
        .cl-pricingTable__card:hover {
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
        }
        
        .cl-pricingTable__card[data-popular="true"] {
          border-color: #14B8A6 !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
        }
        
        .cl-pricingTable__badge {
          background: linear-gradient(to right, #14B8A6, #0D9488) !important;
          color: white !important;
          border-radius: 9999px !important;
          padding: 0.5rem 1.5rem !important;
          font-weight: 700 !important;
          font-size: 0.875rem !important;
        }
        
        .cl-pricingTable__price {
          font-size: 3rem !important;
          font-weight: 700 !important;
          color: #111827 !important;
        }
        
        .cl-pricingTable__button {
          width: 100% !important;
          padding: 1.5rem !important;
          border-radius: 0.75rem !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
          transition: all 0.3s ease !important;
        }
        
        .cl-pricingTable__button[data-variant="primary"] {
          background: #14B8A6 !important;
          color: white !important;
        }
        
        .cl-pricingTable__button[data-variant="primary"]:hover {
          background: #0D9488 !important;
        }
        
        .cl-pricingTable__button[data-variant="outline"] {
          border: 2px solid #d1d5db !important;
          color: #374151 !important;
          background: white !important;
        }
        
        .cl-pricingTable__button[data-variant="outline"]:hover {
          background: #f9fafb !important;
        }
        
        .cl-pricingTable__feature {
          display: flex !important;
          align-items: flex-start !important;
          gap: 0.75rem !important;
          color: #374151 !important;
          font-size: 0.875rem !important;
        }
        
        .cl-pricingTable__featureIcon {
          width: 1.25rem !important;
          height: 1.25rem !important;
          background: #D1FAE5 !important;
          border-radius: 9999px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
          margin-top: 0.125rem !important;
        }
        
        .cl-pricingTable__featureIcon svg {
          width: 0.75rem !important;
          height: 0.75rem !important;
          color: #14B8A6 !important;
        }
      `}</style>
    </div>
  )
}

export default Billing
