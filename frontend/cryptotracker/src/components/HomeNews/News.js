import React, { useState, useEffect, useContext, useRef } from "react";
import ThemeContext from "../ThemeContext/ThemeContext";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";




function News() {
  const { theme } = useContext(ThemeContext); // Using ThemeContext
  const [showArrows, setShowArrows] = useState(false); // State to control arrow visibility

  const scrollContainerRef = useRef(null);

  const scroll = (amount) => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
};


  return (
    <div className={`w-full  relative${theme === "dark" ? " " : " "}`}>
       <h2 className='headline-28'>News</h2>
       {/* News Container */}
       <div className=' w-full h-[380px] flex gap-4 mt-4 p-3 overflow-x-scroll'
                ref={scrollContainerRef}
                onMouseEnter={() => setShowArrows(true)}
                onMouseLeave={() => setShowArrows(false)}
            >
        {/* News Card */}
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        
        {/* ----------------------------------- */}
        
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>
        <div className={`w-[320px] h-full flex flex-col gap-3 border border-primary-300/50 shadow-lg shadow-primary-800/70 rounded-xl p-7  flex-shrink-0 ${theme === "dark" ? " " : " "}`}>
            {/* Top */}
            <div className='w-full h-auto flex gap-4 items-center label-14'>
                {/* Image */}
                <img className='w-[29px] h-[29px] border rounded-full' />
                {/* Symbol */}
                <p>DXY</p>
                {/* Date */}
                <p>Mar 25 2024</p>
            </div>
            {/* Middle */}
            <div className='w-full h-auto  flex gap-4'>
                {/* News Headline */}
                <p className='w-[250px] label-semibold-18'>DXY: Dollar Index Price Shapes Symmetrical Triangle Stretching Back to July 2023</p>
                {/* News Image */}
                <img className='w-[72px] h-[72px] flex flex-shrink-0 border rounded-full' />
            </div>
            {/* Bottom */}
            <div className='w-[100%] h-[96px] body-16 '>
                <p className='w-full'>Red-hot week fueled the buck's rally after traders digested the latest from the Fed and still preferred to bet on the haven currency.</p>
            </div>
        </div>

        
        {/* ----------------------------------- */}

            {/* Arrows */}
            {/* Arrow Left */}
            <button
                    className="absolute left-0 top-1/2 rounded-full p-3 bg-primary-900/60 hover:bg-[#131313]/95 hover:text-primary-500"
                    onClick={() => scroll(-320)}
                    style={{ display: showArrows ? 'block' : 'none' }}
                >
                    <IconChevronLeft size={25} />
                </button>
                <button
                    className="absolute right-0 top-1/2 rounded-full p-3 bg-primary-900/60 hover:bg-[#131313]/95 hover:text-primary-500"
                    onClick={() => scroll(320)}
                    style={{ display: showArrows ? 'block' : 'none' }}
                >
                    <IconChevronRight size={25} />
                </button>
        </div>
    </div>
  )
}

export default News