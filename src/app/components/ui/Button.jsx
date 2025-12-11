import React from "react";

const colors = {
  blue: "h-10 text-sm mx-2 px-6 bg-indigo-600 rounded-lg text-white p-2 hover:bg-blue-800",
  gray: "h-10 text-sm mx-2 px-6 bg-gray-200 text-black text-lg rounded-lg hover:bg-gray-300",
};

export default function Button({ onClick, text = "Click", color = "blue", className = "" }) {
  const buttonClass = colors[color];
  return (
    <div className="text-center text-lg pb-4">
      <button onClick={onClick} className={`${buttonClass} ${className}`}>
        {text}
      </button>
    </div>
  );
}