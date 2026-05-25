import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-md transition">
      
      {/* TITLE */}
      <p className="text-gray-500 text-sm font-medium mb-2">
        {title}
      </p>

      {/* VALUE */}
      <h2 className="text-2xl font-bold text-[#24426d]">
        {value ?? 0}
      </h2>

    </div>
  );
};

export default StatCard;