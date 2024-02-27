import React from 'react'
import TradingViewWidget from '../components/TradingViewWidget'

function HeatMap() {
    
  return (
    <div className="w-full h-[600px] ">
        <h2 className='text-4xl font-bold flex justify-center p-2'>HEATMAP</h2>
        <TradingViewWidget />
    </div>
  )
}

export default HeatMap