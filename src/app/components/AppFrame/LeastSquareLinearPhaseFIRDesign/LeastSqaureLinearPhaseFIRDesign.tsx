
import React, { useEffect, useState } from 'react'
import { Plot } from '../Common/Plot'
import FFT from 'fft.js';
import { LS_LPFIRPanel } from './LS-LPFIRPanel';
import { FilterTest } from '../Common/FilterTest';
import { leastSquares_linearPhaseFIR, ZeroPad } from '../Common/Utils';
import { Equation } from '../Common/Equation';

export const LeastSqaureLinearPhaseFIRDesign = () => {
    const [trigger, setTrigger] = useState(false);

    const [filterSize, setFilterSize] = useState(11);
    const [frequencies, setFrequencies] = useState([0, 0.15, 0.85, 1]);
    const [amplitudes, setAmplitudes] = useState([1, 1, 0, 0]);
    const [weights, setWeights] = useState([1, 100]);

    const [filterCoefficients, setFilterCoefficients] = useState<{ num: any[]; den: any[] }>({ num: [1], den: [] });

    const [magnitudeResponse, setMagnitudeResponse] = useState({
        xValues: Array.from({ length: 1024 }, (_, i) => i / 1024 * Math.PI),
        yValues: Array.from({ length: 1024 }, (_, i) => 0)
    });

    const run = () => {
        let h = leastSquares_linearPhaseFIR(frequencies, amplitudes, weights, filterSize);
        console.log(weights)
        setFilterCoefficients({ num: h, den: [1] });
        const fftN = 1024;
        let out = {
            xValues: Array.from({ length: fftN / 2 }, (_, i) => i / fftN * 2 * Math.PI),
            yValues: Array.from({ length: fftN / 2 }, (_, i) => 0)
        };
        const fft = new FFT(fftN);
        const spectrum = fft.createComplexArray();
        fft.realTransform(spectrum, ZeroPad(h, fftN));

        // Compute magnitude of freq. response
        const magnitude = new Array(fftN);
        for (let i = 0; i < fftN / 2; i++) {
            magnitude[i] = Math.sqrt(Math.pow(spectrum[i * 2], 2) + Math.pow(spectrum[i * 2 + 1], 2));
        }
        out.yValues = magnitude;
        setMagnitudeResponse(() => out);
    }

    useEffect(() => {
        run();    
    }, [trigger]);

    return (
        <div className="flex flex-1 items-stretch justify-center">
            <div className="flex flex-col">
                <LS_LPFIRPanel
                    filterSize={filterSize} updateFilterSize={(e) => setFilterSize(e)}
                    frequencies={frequencies} updateFrequencies={(e) => setFrequencies(e)}
                    amplitudes={amplitudes} updateAmplitudes={(e) => setAmplitudes(e)}
                    weights={weights} updateWeights={(e) => setWeights(e)}
                    trigger={trigger} updateTrigger={(e) => setTrigger(e)}
                />
                <FilterTest filterCoefficients={filterCoefficients} />
            </div>
            <Plot title="Magnitude" x_axis_label="w (rad)" y_axis_label="|H(jw)|" dataToPlot={magnitudeResponse} plotColor={"rgba(75, 192, 192, 1)"} />
            <Equation filterCoefficients={"[" + filterCoefficients.num.map((x) => String(x.toFixed(4))).join(" ") + "]"} />

        </div>

    )
}
