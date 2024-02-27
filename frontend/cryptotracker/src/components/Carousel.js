// src/components/Carousel.js
import React from 'react';

const Carousel = ({ exchanges }) => {
  return (
    <div className="flex overflow-x-auto gap-4 p-4">
      {exchanges.map((exchange) => (
        <div key={exchange.id} className="min-w-[200px] bg-[#FAFAFA] rounded-lg shadow p-4">
          <img src={exchange.image} alt={exchange.name} className="w-10 h-10 mx-auto" />
          <h3 className="text-center mt-2 font-bold">{exchange.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
