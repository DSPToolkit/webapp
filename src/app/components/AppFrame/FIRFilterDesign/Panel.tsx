import React, { useState } from 'react'
import { windowType, filterType } from './enums';

export const Panel = ({trigger, updateTrigger,
                       chosenFilterType, updateChoosenFilterType, 
                       chosenWindowType, updateChosenWindowType,
                       filterSize, updateFilterSize,
                       lowPassCutoff, updateLowpassCutoff
                    }) => {

    const [fitlerTypeDropdownIsOpen, setFitlerTypeDropdownIsOpen] = useState(false);
    const [windowTypeDropdownIsOpen, setWindowTypeDropdownIsOpen] = useState(false);

    const toggleFilterTypeDropdown = () => setFitlerTypeDropdownIsOpen(!fitlerTypeDropdownIsOpen);
    const toggleWindowTypeDropdown = () => setWindowTypeDropdownIsOpen(!windowTypeDropdownIsOpen);

    return (
        <div className="flex flex-col justify-between h-screen h-48 bg-gray-50 p-2 m-5 rounded-2xl shadow-md" style={{ height: '320px', width: '500px' }}>

            <div className="m-4">
                <div id="content">
                    <div className="flex items-center">
                        <label>Filter Type: </label>
                        <div className="relative mx-2">
                            <button onClick={toggleFilterTypeDropdown} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-gray-700">
                                {chosenFilterType}
                            </button>

                            {fitlerTypeDropdownIsOpen && (
                                <div className="absolute flex flex-col bg-white p-3 shadow  rounded-lg">
                                    <a id="chooseFilterType" onClick={() => updateChoosenFilterType(filterType.LOWPASS)} className="my-0.5 w-24 cursor-pointer">Low-pass</a>
                                    {/* <a id="chooseFilterType" onClick={() => updateChoosenFilterType(filterType.LOWPASS)} className="my-0.5 w-24 cursor-pointer">Low-pass</a> */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {chosenFilterType == "Low-pass" &&
                    (
                        <div className="mt-3">
                            <label>Cuttoff Freq:</label>
                            <input className="rounded-lg shadow p-1 my-3 w-32 mx-1" onChange={(e) => updateLowpassCutoff(Number(e.target.value))} value={lowPassCutoff} placeholder="Rad/Samples" type="number" step="0.01" max="3.14" min="0"></input>

                            <div className="flex items-center">
                                <label>Window Type: </label>
                                <div className="relative mx-2">
                                    <button onClick={toggleWindowTypeDropdown} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-gray-700 w-32">
                                        {chosenWindowType}
                                    </button>
                                    {windowTypeDropdownIsOpen && (
                                        <div className="absolute flex flex-col bg-white p-3 shadow  rounded-lg">
                                            <a id="chooseFilterType" onClick={() => updateChosenWindowType(windowType.RECTANGULAR)} className="my-0.5 w-24 cursor-pointer">Rectangular</a>
                                            <a id="chooseFilterType" onClick={() => updateChosenWindowType(windowType.HAMMING)} className="my-0.5 w-24 cursor-pointer">Hamming</a>
                                            <a id="chooseFilterType" onClick={() => updateChosenWindowType(windowType.HAN)} className="my-0.5 w-24 cursor-pointer">Han</a>
                                            <a id="chooseFilterType" onClick={() => updateChosenWindowType(windowType.BARTLETT)} className="my-0.5 w-24 cursor-pointer">Bartlett</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <label>Filter Size:</label>
                            <input className="rounded-lg shadow p-1 my-3 w-32 mx-1" onChange={(e) => updateFilterSize(Number(e.target.value))} value={filterSize} placeholder="Size" type="number" min="0" max="1000"></input>
                        </div>
                    )
                }
            </div>

            <div className="text-center text-lg pb-4">
                <button onClick={() => updateTrigger(!trigger)} className={`h-10 my-2 text-sm mx-2 px-6 bg-blue-500 rounded-lg text-white p-2 hover:bg-gray-400`}>Design Filter</button>
            </div>
        </div >
    )
}
