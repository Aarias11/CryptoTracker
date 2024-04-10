// src/components/Carousel.js
import React from 'react';



const Carousel = ({ theme, topExchanges, openModal }) => {
  return (
    <div className="flex gap-6 overflow-x-auto">
          {topExchanges?.map((exchange) => (
            <div
              key={exchange.id}
              className={`cursor-pointer md:w-[163px] lg:w-[188px] xl:w-[250px] h-auto flex-shrink-0 p-[20px] rounded-xl ${
                theme === "dark" ? "bg-primary-900" : "bg-gray-100"
              }`}
              onClick={() => openModal(exchange)}
            >
              <div className="flex flex-col gap-2">
                <img
                  src={exchange.image}
                  alt={exchange.name}
                  className="w-16 h-16 mx-auto"
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
  );
};

export default Carousel;
