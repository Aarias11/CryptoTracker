// src/components/Carousel.js
import React, { useState, useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const Carousel = ({ theme, topExchanges, openModal }) => {
  const [showArrows, setShowArrows] = useState(false); // State to control arrow visibility


  // 
  const scrollContainerRef = useRef(null);

  const scroll = (amount) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex  relative">
      {/* Container */}
      <div
        className="flex gap-6 overflow-x-auto"
        ref={scrollContainerRef}
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        {topExchanges?.map((exchange) => (
          <div
            key={exchange.id}
            className={`cursor-pointer md:w-[163px] lg:w-[188px] xl:w-[250px] h-auto flex-shrink-0 p-[20px] rounded-xl border ${
              theme === "dark"
                ? "bg-primary-900 border-primary-800 shadow-md shadow-primary-900"
                : "bg-primary-50 border-primary-100 shadow-md shadow-primary-100"
            }`}
            onClick={() => openModal(exchange)}
          >
            <div className="flex flex-col gap-2">
              <img
                src={exchange.image}
                alt={exchange.name}
                className="w-16 h-16 mx-auto rounded-full"
              />
              <h3 className="mt-2 text-center title-16">{exchange.name}</h3>

              <p
                className={`text-center md:label-14 lg:label-16 xl:label-18 ${
                  theme === "dark" ? "text-primary-200" : ""
                }`}
              >
                Rank
              </p>
              <p
                className={`text-center sm:body-14 md:body-16 lg:body-18 xl:body-20 ${
                  theme === "dark" ? "" : ""
                }`}
              >
                {exchange.trust_score_rank}
              </p>
              <p
                className={`text-center md:label-14 lg:label-16 xl:label-18 ${
                  theme === "dark" ? "text-primary-200" : ""
                }`}
              >
                Volume
              </p>
              <p className="text-center sm:body-14 md:body-16 lg:body-18 xl:body-20">
                {exchange.trade_volume_24h_btc.toLocaleString()} BTC
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Arrow Left */}
      <button
        className="absolute left-0 top-32 rounded-full p-3 bg-primary-900/60 hover:bg-[#131313]/95 hover:text-primary-500"
        onClick={() => scroll(-320)}
        style={{ display: showArrows ? "block" : "none" }}
      >
        <IconChevronLeft size={25} />
      </button>
      <button
        className="absolute right-0 top-32 rounded-full p-3 bg-primary-900/60 hover:bg-[#131313]/95 hover:text-primary-500"
        onClick={() => scroll(320)}
        style={{ display: showArrows ? "block" : "none" }}
      >
        <IconChevronRight size={25} />
      </button>
    </div>
  );
};

export default Carousel;
