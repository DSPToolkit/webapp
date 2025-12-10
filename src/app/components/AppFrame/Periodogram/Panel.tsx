import React, { useState } from 'react'
import { signalExprParser } from '../Common/SignalExpressionParser';

export const Panel = ({ data, updateData, showInDbScale, updateShowInDbScale
}) => {
    const [textboxText, updateTextboxText] = useState("");
    const METHODS = { fileupload: "File upload", expression: "Expression" }
    const [method, setMethod] = useState(METHODS.fileupload);
    const [popupOpen, setPopupOpen] = useState(false);
    const togglePopup = () => { setPopupOpen(!popupOpen); }
    const parseData = (s) => {
        const arr = s.split(/[,\s]+/).filter(Boolean).map(Number);

        for (const n of arr) {
            if (!Number.isFinite(n))
                throw new Error("Invalid number");
        }
        return arr;
    };

    const handleExpression = () => {
        const signal = signalExprParser(textboxText);
        console.log(signal)
        updateData(signal);
    }

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const text = evt.target.result;
            try {
                updateData(parseData(text));
            } catch (err) {
                console.error(err.message);
            }
        };

        reader.readAsText(file);
    };
    return (
        <div className="flex flex-col h-screen h-48 bg-gray-50 p-2 my-5 mx-2 rounded-2xl shadow-md" style={{ height: '322px', width: '515px' }}>
            <div className="flex justify-between flex-1 mx-5 my-1 mt-8">
                <div className="flex items-center">
                    <label>Input Type: </label>
                    <div className="relative mx-2">
                        <button onClick={togglePopup} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-gray-700">
                            {method}
                        </button>
                        {popupOpen && (
                            <div className="absolute flex flex-col bg-white p-3 shadow  rounded-lg z-10">
                                <a onClick={() => { setMethod(METHODS.fileupload); togglePopup(); }} className="my-0.5 w-24 cursor-pointer">File Upload</a>
                                <a onClick={() => { setMethod(METHODS.expression); togglePopup(); }} className="my-0.5 w-24 cursor-pointer">Expression</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative group">
                    <button className="w-11 h-11 bg-gray-200 text-black text-lg rounded-full hover:bg-gray-300">
                        ?
                    </button>
                    <div className="pointer-events-none z-50 absolute right-0 top-10 w-80 bg-black text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        The signal you wish to compute Periodogram for can be received by uploading a data file or writing its expression.
                    </div>
                </div>
            </div>
            {
                method == METHODS.fileupload &&
                <div className="flex flex-col m-5">
                    <div>
                        Please upload a .csv or .txt file where the values of the signal are separated by spaces, commas, or newlines.
                        <br></br><br></br>
                        Rectangular window is asssumed to be applied to the sequence before applying FFT.
                    </div>
                    <div className="flex my-5">
                        <span className="pr-5 mt-2" >Upload file:</span>
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                accept=".txt,.csv,.json"
                                onChange={handleFile}
                            />
                            <div className="px-4 w-32 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition">
                                <span>Choose File</span>
                            </div>

                        </label>
                        <div className="my-2 mx-7">
                            <label>
                                <input
                                    className="mx-2 select-none"
                                    type="checkbox"
                                    checked={showInDbScale}
                                    onChange={(_) => updateShowInDbScale(!showInDbScale)}
                                />
                                <span className="text-gray-900 dark:text-white">Show in Db Scale</span>

                            </label>
                        </div>
                    </div>
                </div>
            }
            {
                method == METHODS.expression &&
                <div className="flex flex-col m-5">
                    <span className="mb-3">Enter the expression for generating the desired signal:</span>
                    <input
                        className="p-2 border-2 border-solid rounded-md"
                        type="text"
                        onChange={(e) => updateTextboxText(e.target.value)} />

                    <div className="flex my-5 justify-center">
                        <label className="cursor-pointer">
                            <div className="text-center text-lg pb-4">
                                <button onClick={() => handleExpression()} className={`h-10 text-sm mx-2 px-6 bg-indigo-600 rounded-lg text-white p-2 hover:bg-blue-800`}>
                                    Compute
                                </button>
                            </div>
                        </label>
                    </div>

                </div>
            }
        </div>


    )
}
