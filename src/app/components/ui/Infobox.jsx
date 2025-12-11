export default function Infobox({ text = "info", className = "" }) {
  return (
    <div className="relative group">
      <button className="w-11 h-11 bg-gray-200 text-black text-lg rounded-full hover:bg-gray-300">
        ?
      </button>
      <div
        className={`pointer-events-none z-50 absolute right-0 top-12 w-80 bg-black text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg ${className}`}
      >
        {text}
      </div>
    </div>
  );
}