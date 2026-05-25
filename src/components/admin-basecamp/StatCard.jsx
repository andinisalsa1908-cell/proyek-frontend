import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-[#24426d]">
        {value ?? 0}
      </p>
    </div>
  );
};

export default StatCard;