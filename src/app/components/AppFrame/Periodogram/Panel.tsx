import React, { useState } from 'react'
import { filterType, IIRfilterDesignMethod } from '../Common/enums';

export const Panel = ({ data, updateData,
}) => {

    const parseData = (s) => {
        const arr = s.split(/[,\s]+/).filter(Boolean).map(Number);

        for (const n of arr) {
            if (!Number.isFinite(n))
                throw new Error("Invalid number");
        }
        return arr;
    };


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
    <div className="flex flex-col justify-between h-screen h-48 bg-gray-50 p-2 my-5 mx-2 rounded-2xl shadow-md" style={{ height: '322px', width: '515px' }}>

        {/* Header / separator space */}
        <div className="mb-3">
            <div className="h-px"></div>
        </div>

        {/* Main content body */}
        <div className="flex-1 mx-4 my-3">
            <div>
            Please upload a .csv or .txt file where the values of the signal are separated by spaces, commas, or newlines.
            <br></br><br></br>
            After uploading the file, the periodogram of the signal will be computed and shown on the graph.
            </div>
        </div>

        <div className="m-5 mb-8 flex items-center">
            <span className="pr-5" >Upload file:</span>
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
        </div>
    </div>

    )
}
