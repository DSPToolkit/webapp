import React, { useEffect, useState } from 'react'
import { Plot } from '../Common/Plot'
import { Panel } from './Panel';
import { elementWiseMultiply, Hamming, Han, RectangleWindow, ZeroPad } from '../Common/Utils';
import FFT from 'fft.js';
import { Window } from './enum';

export const WelchsEstimate = () => {
    const [data, setData] = useState([]);
    const [segmentLength, setSegmentLength] = useState(128);
    const [shiftSize, setShiftSize] = useState(10);
    const [chosenWindowType, setChosenWindowType] = useState(Window.Rectangular);
    const [showInDbScale, setShowInDbScale] = useState(true);

    const [magnitudeResponse, setMagnitudeResponse] = useState({
        xValues: Array.from({ length: 1024 }, (_, i) => i / 1024 * Math.PI),
        yValues: Array.from({ length: 1024 }, (_, i) => 0)
    });

    const createWindowArray = () => {
        switch(chosenWindowType) {
            case Window.Rectangular:
                return RectangleWindow(segmentLength);
            case Window.Han:
                return Han(segmentLength);
            case Window.Hamming:
                return Hamming(segmentLength);
        }
    }

    const computeWelchsEstimate = () => {
        
        const numberOfSegments = Math.floor(1 + (data.length - segmentLength) / shiftSize);
        
        // For non-rectangular window, the window should be normalized
        let w = createWindowArray();
        let sum = 0;
        for (let i = 0; i < w.length; i++)
            sum += w[i] * w[i];
        const windowNormalizationFactor = 1 / Math.sqrt(sum / segmentLength);
        for (let i = 0; i < w.length; i++)
            w[i] *= windowNormalizationFactor;

        let res = {
            xValues: Array.from({ length: segmentLength / 2 },
                (_, i) => i / segmentLength * 2 * Math.PI),
            yValues: new Array(segmentLength / 2).fill(0)
        };

        for (let k = 0; k < numberOfSegments; k++) {
            const fft = new FFT(segmentLength);
            const spectrum = fft.createComplexArray();

            const start = k * shiftSize;

            let seg = data.slice(start, start + segmentLength);

            if (chosenWindowType !== Window.Rectangular)
                seg = elementWiseMultiply(seg, w);

            fft.realTransform(spectrum, seg);

            for (let m = 0; m < segmentLength / 2; m++) {
                const re = spectrum[2 * m];
                const im = spectrum[2 * m + 1];
                res.yValues[m] += (re * re + im * im) / segmentLength;
            }
        }
        
        for (let m = 0; m < res.yValues.length; m++) {
            res.yValues[m] /= numberOfSegments;
        }

        // Compute magnitude of the freq. response
        if (showInDbScale) {
            for (let i = 0; i < res.yValues.length / 2; i++) {
                res.yValues[i] = 10 * Math.log( res.yValues[i] );
            }
        }

        setMagnitudeResponse(() => res);
    }

    useEffect(() => {
        try {
            if (data && data.length > 0) {
                if (shiftSize > segmentLength)
                    throw Error("Number of overlaps should be less than number of segments");

                computeWelchsEstimate();
            }
        } catch (e) {
            alert(e.message)
        }

    }, [data, showInDbScale]);

    return (
        <div className="flex flex-1 items-stretch justify-center">
            <div className="flex flex">
                <Panel
                    data={data} updateData={(e) => setData(e)}
                    segmentLength={segmentLength} updateSegmentLength={(e) => setSegmentLength(e)}
                    shiftSize={shiftSize} updateShiftSize={(e) => setShiftSize(e)}
                    chosenWindowType={chosenWindowType} updateChosenWindowType={(e) => setChosenWindowType(e)}
                    showInDbScale={showInDbScale}
                    updateShowInDbScale={(e) => setShowInDbScale(e) }
                />
                <Plot
                    title="Magnitude"
                    x_axis_label="w (rad)"
                    y_axis_label="|H^2(jw)|"
                    dataToPlot={magnitudeResponse}
                    plotColor={"rgba(75, 192, 192, 1)"} />
            </div>

        </div>

    )
}
