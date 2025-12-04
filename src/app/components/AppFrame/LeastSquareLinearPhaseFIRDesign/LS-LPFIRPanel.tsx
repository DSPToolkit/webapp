import React, { useState } from 'react'

export const LS_LPFIRPanel = ({ trigger, updateTrigger,
    filterSize, updateFilterSize,
    frequencies, updateFrequencies,
    amplitudes, updateAmplitudes
}) => {
    const [freqText, setFreqText] = useState('0 0.15 0.85 1');
    const [amplitudesText, setAmplitudesText] = useState('1 1 0 0');

    const validateFreq = (freqArray) => {
        if (freqArray.length == 0) return false;
        // Check the frequencies are in ascending order and between 0 and Pi  
        for (let i = 0; i < freqArray.length; i++) {
            if (freqArray[i] < 0 || freqArray[i] > Math.PI) return false;
            if (freqArray[i] < freqArray[i - 1]) return false;
        }

        return true;
    }

    const validateAmplitudes = (freqArray) => {
        if (freqArray.length == 0) return false;
        for (let i = 0; i < freqArray.length; i++) {
            if (freqArray[i] < 0) return false;
        }

        return true;
    }
    return (
        <div className="bg-gray-50 p-4 my-5 mx-2 rounded-2xl shadow-md">
            <div className="flex justify-between">
                <div className="flex flex-col my-2 mx-3">
                    <label className="my-6 mb-2">Amplitudes:</label>
                    <label className="my-6 mb-2">Frequencies:</label>
                    <label className="my-6 mb-2">Filter Size:</label>

                </div>
                
                <div className="flex flex-col m-4">
                    <div className="flex items-center">

                        <input
                            type="text"
                            className="rounded-lg shadow p-2 m-2 w-64"
                            value={amplitudesText}
                            onChange={(e) => setAmplitudesText(e.target.value)}
                            placeholder="Amplitudes (space separated)"
                        />

                    </div>
                    <div className="flex items-center">

                        <input
                            type="text"
                            className="rounded-lg shadow p-2 m-2 w-64"
                            value={freqText}
                            onChange={(e) => setFreqText(e.target.value)}
                            placeholder="Frequencies (space separated)"
                        />
                    </div>
                    <div>
                        <div className="flex items-center ">

                            <input
                                type="number"
                                min="0" max="1000"
                                step="2"
                                className="rounded-lg shadow p-1 my-4 w-32 mx-1"
                                value={filterSize}
                                onChange={(e) =>
                                Number(e.target.value) % 2 === 0
                                    ? updateFilterSize(Number(e.target.value) + 1)
                                    : updateFilterSize(Number(e.target.value))
                                } />
                        </div>

                    </div>
                </div>

                <div className="relative my-5 mx-2 group ml-2">
                    <button className="w-11 h-11 bg-gray-200 text-black text-lg rounded-full hover:bg-gray-300">
                        ?
                    </button>
                    <div className="pointer-events-none z-50 absolute right-0 top-12 w-80 bg-black text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        Enter normalized frequency ranges and their corresponding amplitudes as pairs.
                        <br></br>Ex: Freq = [0 0.2 0.8 1], Amp = [1 1 0 0] defines a lowpass filter with unity gain from 0-0.2 and zero elsewhere.
                    </div>
                </div>

            </div>
            <div className="text-center text-lg pb-4">
                <button
                    onClick={() => {
                        const freqArray = freqText
                            .split(' ')
                            .map(x => parseFloat(x.trim()))
                            .filter(x => !isNaN(x));

                        const amplitudesArray = amplitudesText
                            .split(' ')
                            .map(x => parseFloat(x.trim()))
                            .filter(x => !isNaN(x));

                        if ((validateFreq(freqArray) && validateAmplitudes(amplitudesArray)) && freqArray.length == amplitudesArray.length) {
                            updateTrigger(!trigger);
                            updateFrequencies(freqArray);
                            updateAmplitudes(amplitudesArray);
                        }
                    }}
                    className="h-10 my-3 text-sm mx-2 px-6 bg-indigo-600 rounded-lg text-white p-2 hover:bg-blue-800"
                >
                    Design Filter
                </button>
            </div>

        </div>

    )
}
