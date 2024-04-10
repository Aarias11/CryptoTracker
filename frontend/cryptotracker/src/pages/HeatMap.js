import React from 'react'
import TradingViewWidget from '../components/TradingView/TradingViewWidget'

function HeatMap() {
    
  return (
    <div className="w-full h-screen px-7">
        {/* <h2 className='text-4xl font-bold flex justify-center p-2 pt-10 pb-10'>HEATMAP</h2> */}
        <TradingViewWidget />
    </div>
  )
}

export default HeatMap