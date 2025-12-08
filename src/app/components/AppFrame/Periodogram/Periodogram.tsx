import React, { useEffect, useState } from 'react'
import { Plot } from '../Common/Plot'
import { Panel } from './Panel';
import { ZeroPad } from '../Common/Utils';
import FFT from 'fft.js';

export const Periodogram = () => {
    const [data, setData] = useState([]);

    const [magnitudeResponse, setMagnitudeResponse] = useState({
        xValues: Array.from({ length: 1024 }, (_, i) => i / 1024 * Math.PI),
        yValues: Array.from({ length: 1024 }, (_, i) => 0)
    });

    const [phaseResponse, setPhaseResponse] = useState({
        xValues: Array.from({ length: 50 }, (_, i) => i / 50 * Math.PI),
        yValues: Array.from({ length: 50 }, (_, i) => 0)
    });

    const findTheNextPowerOfTwoBiggerThanX = (x : number) => {
        let v = 1;
        while(v < x) {
            v = v * 2;
        }
        return v;
    }
    const computePeriodogram = () => {
        let FFTSize = findTheNextPowerOfTwoBiggerThanX(data.length);
        let outPlotMag = {
            xValues: Array.from({ length: FFTSize / 2 }, (_, i) => i / FFTSize * 2 * Math.PI),
            yValues: new Array(FFTSize/2)
        };

        const fft = new FFT(FFTSize);
        const spectrum = fft.createComplexArray();
        fft.realTransform(spectrum, ZeroPad(data, FFTSize));

        // Compute magnitude of the freq. response
        for (let i = 0; i < FFTSize / 2; i++) {
            outPlotMag.yValues[i] = (1/FFTSize) * (Math.pow(spectrum[i * 2], 2) + Math.pow(spectrum[i * 2 + 1], 2));
        }
        setMagnitudeResponse(() => outPlotMag)
    }

    useEffect(() => {
        if(data.length > 0)
            computePeriodogram();
    }, [data]);

    return (
        <div className="flex flex-1 items-stretch justify-center">
            <div className="flex flex">
                <Panel
                    data={data} updateData={(e) => setData(e)}
                />
                <Plot
                    title="Magnitude"
                    x_axis_label="w (rad)"
                    y_axis_label="|H(jw)|"
                    dataToPlot={magnitudeResponse}
                    plotColor={"rgba(75, 192, 192, 1)"} />
            </div>

        </div>

    )
}
