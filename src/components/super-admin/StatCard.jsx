import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm text-center">
      
      <h3 className="text-gray-400 text-sm mb-1">
        {title}
      </h3>

      <h2 className="text-2xl font-bold text-[#24426d]">
        {value}
      </h2>

    </div>
  );
};

export default StatCard;