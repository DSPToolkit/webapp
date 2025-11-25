// import MathJax from 'better-react-mathjax/MathJax'
import React, { useEffect, useState } from 'react'

export const IIREquation = ({ filterCoefficients }) => {
  const [filterEquation, setFilterEquation] = useState('');

  const constructFilterEquationString = (filterCoefficients) => {
    if(filterCoefficients.num.length == 0 && filterCoefficients.den.length == 0) return "y[n] = x[n]";
    let output = "y[n] = x[n]";
    for (let i = 1; i < filterCoefficients.num.length; i++) {
      if (filterCoefficients.num[i] != 0) {
        output += (Number(filterCoefficients.num[i]) < 0 ? " - " : " + ") + ( Number(filterCoefficients.num[i]) == 1 ? "" : String(Math.abs(Number(filterCoefficients.num[i])).toFixed(2))) + 
          ( i == 0 ? "x[n]" : "x[n" + ("-" + String(i) + "]" ))
      }
    }

    for (let i = 0; i < filterCoefficients.den.length; i++) {

      if (filterCoefficients.den[i] != 0) {
        output += (Number(filterCoefficients.den[i]) > 0 ? " - " : " + ") + ( Number(filterCoefficients.den[i]) == 1 ? "" : String(Math.abs(Number(filterCoefficients.den[i])).toFixed(2))) + 
          ( i == 0 ? "y[n]" : "y[n" + ("-" + String(i) + "]" ))
      }
    }
    return output;
  }

  useEffect(() => {
      if(filterCoefficients) setFilterEquation(() => constructFilterEquationString(filterCoefficients));
  }, [filterCoefficients]);

  return (
    <div className="overflow-x-scroll bg-gray-50 p-2 my-5 mx-2 rounded-2xl shadow-md" style={{ height: '168px', width: '530px'}}>
      <div className="p-4">
        <div className="font-bold">
          Filter equation:
        </div>
        {filterEquation ? filterEquation : "Empty"}
      </div>
    </div >
  )
}
