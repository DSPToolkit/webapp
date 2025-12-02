import React, { useEffect, useState } from 'react'
import { Plot } from '../Common/Plot'
import FFT from 'fft.js';
import { Panel } from './Panel';
import { windowType, filterType } from './enums';
import { FilterTest } from '../Common/FilterTest';
import { Equation } from '../Common/Equation';
import { ZeroPad, lowPassImpulseResponse, bandpassImpulseResponse, elementWiseMultiply, elementWiseAdd, Hamming, Bartlett, Han } from '../Common/Utils';

export const FIRFilterDesign = () => {
    const [trigger, setTrigger] = useState(false);

    const [filterSize, setFilterSize] = useState(10);
    const [filterCoefficients, setFilterCoefficients] = useState<{ num: any[]; den: any[] }>({ num: [1], den: [] });
    const [lowCutoff, setLowCutoff] = useState(0.5);
    const [highCutoff, setHighCutoff] = useState(0.9);
    const [chosenFilterType, setChosenFilterType] = useState(filterType.LOWPASS);
    const [chosenWindowType, setChosenWindowType] = useState(windowType.RECTANGULAR);

    const [magnitudeResponse, setMagnitudeResponse] = useState({
        xValues: Array.from({ length: 1024 }, (_, i) => i / 1024 * Math.PI),
        yValues: Array.from({ length: 1024 }, (_, i) => 0)
    });

    // TODO: use w1 and w2 later. they're not being used rn.
    const getImpulseResponse = (w1, w2, N = 1024) => {
        switch (chosenFilterType) {
            case "Low-pass":
                return lowPassImpulseResponse(highCutoff, N);
            case "High-pass":
                return bandpassImpulseResponse(Math.PI, lowCutoff, N);
            case "Band-pass":
                return bandpassImpulseResponse(lowCutoff, highCutoff, N);
            case "Band-stop":
                return elementWiseAdd(bandpassImpulseResponse(Math.PI, highCutoff, N), lowPassImpulseResponse(lowCutoff, N));
        }
    }

    const run = () => {
        const N = 1024;
        let out = {
            xValues: Array.from({ length: N / 2 }, (_, i) => i / N * 2 * Math.PI),
            yValues: Array.from({ length: N / 2 }, (_, i) => 0)
        };
        let x = [];
        switch (chosenWindowType) {
            case "Rectangular":
                x = getImpulseResponse(lowCutoff, highCutoff, filterSize)
                break;
            case "Bartlett":
                x = elementWiseMultiply(getImpulseResponse(lowCutoff, highCutoff, filterSize), Bartlett(filterSize))
                break;
            case "Hamming":
                x = elementWiseMultiply(getImpulseResponse(lowCutoff, highCutoff, filterSize), Hamming(filterSize))
                break;
            case "Han":
                x = elementWiseMultiply(getImpulseResponse(lowCutoff, highCutoff, filterSize), Han(filterSize))
                break;
        }
        setFilterCoefficients({ num: x, den: [1] });

        const fft = new FFT(N);
        const spectrum = fft.createComplexArray();
        fft.realTransform(spectrum, ZeroPad(x, N));

        // Compute magnitude of freq. response
        const magnitude = new Array(N);
        for (let i = 0; i < N / 2; i++) {
            magnitude[i] = Math.sqrt(Math.pow(spectrum[i * 2], 2) + Math.pow(spectrum[i * 2 + 1], 2));
        }
        out.yValues = magnitude;
        setMagnitudeResponse(() => out)
    }

    useEffect(() => {
        run();
    }, [trigger]);

    return (
        <div className="flex flex-1 items-stretch justify-center">
            <div className="flex flex-col">
                <Panel
                    trigger={trigger} updateTrigger={(e) => setTrigger(e)}
                    chosenFilterType={chosenFilterType} updateChoosenFilterType={(e) => setChosenFilterType(e)}
                    chosenWindowType={chosenWindowType} updateChosenWindowType={(e) => setChosenWindowType(e)}
                    filterSize={filterSize} updateFilterSize={(e) => setFilterSize(e)}
                    lowCutoff={lowCutoff} updateLowCutoff={(e) => setLowCutoff(e)}
                    highCutoff={highCutoff} updateHighCutoff={(e) => setHighCutoff(e)}
                />
                <FilterTest filterCoefficients={filterCoefficients} />
            </div>
            <Plot title="Magnitude" x_axis_label="w (rad)" y_axis_label="|H(jw)|" dataToPlot={magnitudeResponse} plotColor={"rgba(75, 192, 192, 1)"} />
            <Equation filterCoefficients={"[" + filterCoefficients.num.map((x) => String(x.toFixed(4))).join(" ") + "]"} />

        </div>

    )
}
