import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const ConfigurePopup = ({
    isOpen,
    onClose,
    peak,
    noiseMean,
    noiseSd,
    updatePeak,
    updateMean,
    updateSd,
}) => {
    const [localPeak, setLocalPeak] = useState(peak);
    const [localNoiseMean, setLocalNoiseMean] = useState(noiseMean);
    const [localNoiseSd, setLocalNoiseSd] = useState(noiseSd);

    useEffect(() => {
        if (isOpen) {
            setLocalPeak(peak);
            setLocalNoiseMean(noiseMean);
            setLocalNoiseSd(noiseSd);
        }
    }, [isOpen, peak, noiseMean, noiseSd]);

    const handleSet = () => {
        updatePeak(localPeak);
        updateMean(localNoiseMean);
        updateSd(localNoiseSd);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-5 rounded shadow-lg min-w-[300px]"
                onClick={(e) => e.stopPropagation()}
            >
                <label className="block mb-2">
                    Peak:
                    <input
                        type="number"
                        min="0"
                        autoComplete="off"
                        className="shadow-sm m-2 p-1 w-full"
                        value={localPeak}
                        onChange={(e) => setLocalPeak(e.target.value)}
                    />
                </label>

                <label className="block mb-2">
                    Noise Mean:
                    <input
                        type="number"
                        min="0"
                        autoComplete="off"
                        className="shadow-sm m-2 p-1 w-full"
                        value={localNoiseMean}
                        onChange={(e) => setLocalNoiseMean(e.target.value)}
                    />
                </label>

                <label className="block mb-4">
                    Noise SD:
                    <input
                        type="number"
                        min="0"
                        autoComplete="off"
                        className="shadow-sm m-2 p-1 w-full"
                        value={localNoiseSd}
                        onChange={(e) => setLocalNoiseSd(e.target.value)}
                    />
                </label>

                <div className="flex justify-end">
                    <button
                        className="h-10 mx-2 px-7 bg-gray-300 text-black text-sm rounded-lg hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="h-10 mx-2 px-7 bg-indigo-700 text-white text-sm rounded-lg hover:bg-blue-800"
                        onClick={handleSet}
                    >
                        Set
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
