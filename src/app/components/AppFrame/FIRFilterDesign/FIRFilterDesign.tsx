import React, { useEffect, useState } from 'react'
import { Plot } from '../Common/Plot'
import FFT from 'fft.js';
import { Hamming, Bartlett, Han } from "./Window"
import { Panel } from './Panel';
import { windowType, filterType } from './enums';
import { FilterTest } from '../Common/FilterTest';
import { Equation } from './Equation';

export const FIRFilterDesign = () => {
    const [trigger, setTrigger] = useState(false);

    const [filterSize, setFilterSize] = useState(10);
    const [filterCoefficients, setFilterCoefficients] = useState<{ num: any[]; den: any[] }>({ num: [1], den: [] });
    const [lowPassCutoff, setLowPassCutoff] = useState(0.5);
    const [chosenFilterType, setChosenFilterType] = useState(filterType.LOWPASS);
    const [chosenWindowType, setChosenWindowType] = useState(windowType.RECTANGULAR);


    const [magnitudeResponse, setMagnitudeResponse] = useState({
        xValues: Array.from({ length: 1024 }, (_, i) => i / 1024 * Math.PI),
        yValues: Array.from({ length: 1024 }, (_, i) => 0)
    });

    const lowPassImpulseResponse = (cutOffFreq, N = 1024) => {
        let array = new Array(N).fill(0);
        for (let i = 0; i < N; i++) {
            if (i == N / 2) array[i] = cutOffFreq / Math.PI; // TODO: Check whether this is correct
            else array[i] = 1 / (Math.PI * (i - (N / 2))) * Math.sin(cutOffFreq * (i - N / 2));
        }

        return array;
    }

    const ZeroPad = (array, sizeOfTheZeroPaddedArray) => {
        console.assert(array.length < sizeOfTheZeroPaddedArray);
        let theRestOfTheZeroPaddedArray = new Array(sizeOfTheZeroPaddedArray - array.length).fill(0);
        return array.concat(theRestOfTheZeroPaddedArray);
    }

    const elementWiseMultiply = (arr1, arr2) => {
        console.assert(arr1.length == arr2.length);
        let res = new Array(arr1.length);
        for (let i = 0; i < arr1.length; i++) {
            res[i] = arr1[i] * arr2[i];
        }
        return res;
    }

    const computeFFT = () => {
        const N = 1024;
        let out = {
            xValues: Array.from({ length: N / 2 }, (_, i) => i / N * 2 * Math.PI),
            yValues: Array.from({ length: N / 2 }, (_, i) => 0)
        };
        // const x = Array.from({ length: N }, (_, i) => i > 70 && i < 100 ? 1 : 0 );
        let x = [];
        switch (chosenWindowType) {
            case "Rectangular":
                x = lowPassImpulseResponse(lowPassCutoff, filterSize)
                break;
            case "Bartlett":
                x = elementWiseMultiply(lowPassImpulseResponse(lowPassCutoff, filterSize), Bartlett(filterSize))
                break;
            case "Hamming":
                x = elementWiseMultiply(lowPassImpulseResponse(lowPassCutoff, filterSize), Hamming(filterSize))
                break;
            case "Han":
                x = elementWiseMultiply(lowPassImpulseResponse(lowPassCutoff, filterSize), Han(filterSize))
                break;
        }
        setFilterCoefficients({ num: x, den: [1] });

        const fft = new FFT(N);
        const spectrum = fft.createComplexArray();
        fft.realTransform(spectrum, ZeroPad(x, N));

        const magnitude = new Array(N);
        for (let i = 0; i < N / 2; i++) {
            magnitude[i] = Math.sqrt(Math.pow(spectrum[i * 2], 2) + Math.pow(spectrum[i * 2 + 1], 2));
        }
        out.yValues = magnitude;
        setMagnitudeResponse(() => out)
    }

    useEffect(() => {
        computeFFT();
    }, [trigger]);

    return (
        <div className="flex flex-1 items-stretch justify-center">
            <div className="flex flex-col">
                <Panel
                    trigger={trigger} updateTrigger={(e) => setTrigger(e)}
                    chosenFilterType={chosenFilterType} updateChoosenFilterType={(e) => setChosenFilterType(e)}
                    chosenWindowType={chosenWindowType} updateChosenWindowType={(e) => setChosenWindowType(e)}
                    filterSize={filterSize} updateFilterSize={(e) => setFilterSize(e)}
                    lowPassCutoff={lowPassCutoff} updateLowpassCutoff={(e) => setLowPassCutoff(e)}
                />
                <FilterTest filterCoefficients={filterCoefficients} />
            </div>
            <Plot title="Magnitude" x_axis_label="w (rad)" y_axis_label="|H(jw)|" dataToPlot={magnitudeResponse} plotColor={"rgba(75, 192, 192, 1)"} />
            <Equation filterCoefficients={"[" + filterCoefficients.num.map((x) => String(x.toFixed(4))).join(" ") + "]"} />

        </div>

    )
}
