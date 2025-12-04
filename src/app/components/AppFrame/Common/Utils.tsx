import { add, complex, multiply, transpose, pinv } from 'mathjs';
import { filterType } from './enums';
const math = require('mathjs');

export const convolve = (a, b) => {
    let m = a.length + b.length - 1;
    let result = new Array(m).fill(0);
    for (let i = 0; i < a.length; i++) {
        let sum = 0;
        for (let j = 0; j < b.length; j++) {
            result[i + j] = add(result[i + j], multiply(a[i], b[j]));
        }
    }
    return result;
}

export const filter = (signal, filterCoefficients) => {
    const y_buffer = new Array(filterCoefficients.den.length).fill(0);
    let result = [];

    for (let i = 0; i < signal.length; i++) {
        let x_term_sums = 0;
        for (let j = 0; j < filterCoefficients.num.length; j++) {
            x_term_sums += filterCoefficients.num[j] * (i - j < 0 ? 0 : signal[i - j]);
        }

        let y_term_sums = 0;
        for (let j = 1; j < filterCoefficients.den.length; j++) {
            y_term_sums += filterCoefficients.den[j] * (i - j < 0 ? 0 : y_buffer[j - 1]);
        }
        const output = x_term_sums - y_term_sums;

        for (let j = y_buffer.length - 1; j > 0; j--) {
            y_buffer[j] = y_buffer[j - 1];
        }
        y_buffer[0] = output;

        result.push(output);
    }

    return result;
};


export const ZeroPad = (array, sizeOfTheZeroPaddedArray) => {
    console.assert(array.length < sizeOfTheZeroPaddedArray);
    let theRestOfTheZeroPaddedArray = new Array(sizeOfTheZeroPaddedArray - array.length).fill(0);
    return array.concat(theRestOfTheZeroPaddedArray);
}

export const getImpulseResponse = (filterCoefficients, size = 1000) => {
    let impulseSignal = [];
    impulseSignal.push(1);
    for (let i = 0; i < size; i++) {
        impulseSignal.push(0);
    }
    return filter(impulseSignal, filterCoefficients);
}

export const aValueTimesElementsOfArray = (K, arr) => {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        res.push(arr[i] * K);
    }
    return res;
}

export const construct_Z_plus_one_or_Z_minus_one_polynomial = (N, diff) => {
    let polynomialCoeffs = [];
    for (let i = 0; i < N - diff; i++)
        polynomialCoeffs.push([1, 1]);

    for (let i = 0; i < diff; i++)
        polynomialCoeffs.push([1, -1]);

    let res = polynomialCoeffs[0];
    for (let i = 1; i < polynomialCoeffs.length; i++) {
        res = convolve(res, polynomialCoeffs[i]);
    }
    return res;
}
export const addArraysFromRight = (arr1, arr2) => {

    let maxLength = arr1.length > arr2.length ? arr1.length : arr2.length;
    let res = Array(maxLength).fill(0);
    let arr1LastIndex = arr1.length - 1;
    let arr2LastIndex = arr2.length - 1;

    for (let i = maxLength - 1; i >= 0; i--) {
        if (arr1LastIndex >= 0) res[i] += arr1[arr1LastIndex--];
        if (arr2LastIndex >= 0) res[i] += arr2[arr2LastIndex--];
    }

    return res;
};


export const bilinearTransform = (coeff: { num: any[]; den: any[] }) => { // Receives transfer function coefficients as an array
    // Necessary to reverse them to make it suitable to apply the next procedures
    coeff.num = coeff.num.reverse();
    coeff.den = coeff.den.reverse();

    const N = Math.max(coeff.num.length, coeff.den.length) - 1;
    const K = 2;
    let tmp = [];
    for (let i = 0; i < coeff.num.length; i++) {
        tmp.push(aValueTimesElementsOfArray(coeff.num[i] * Math.pow(K, i), construct_Z_plus_one_or_Z_minus_one_polynomial(N, i)));
    }

    let resNum = tmp[0];
    for (let i = 1; i < tmp.length; i++)
        resNum = addArraysFromRight(resNum, tmp[i])

    tmp = [];
    for (let i = 0; i < coeff.den.length; i++) {
        tmp.push(aValueTimesElementsOfArray(coeff.den[i] * Math.pow(K, i), construct_Z_plus_one_or_Z_minus_one_polynomial(N, i)));
    }

    let resDen = tmp[0];
    for (let i = 1; i < tmp.length; i++)
        resDen = addArraysFromRight(resDen, tmp[i])

    // Normalize
    let firstCoefBeforeBeingChanged = resDen[0];
    for (let i = 0; i < resDen.length; i++)
        resDen[i] = resDen[i] / firstCoefBeforeBeingChanged;

    for (let i = 0; i < resNum.length; i++)
        resNum[i] = resNum[i] / firstCoefBeforeBeingChanged;

    return { num: resNum, den: resDen };
}

export const transformAnalogLowpassToHighpass = (poles, Omega_c) => {
    const hpPoles = poles.map(p => {
        const denom = p.re * p.re + p.im * p.im;
        return complex(
            (Omega_c * Omega_c * p.re) / denom,
            (-Omega_c * Omega_c * p.im) / denom
        );
    });

    let tmp = [];
    for (let i = 0; i < hpPoles.length; i++) {
        tmp.push([1, complex(-hpPoles[i].re, -hpPoles[i].im)]);
    }

    let tmp2 = tmp[0];
    for (let i = 1; i < tmp.length; i++) {
        tmp2 = convolve(tmp2, tmp[i]);
    }
    let convRes = tmp2;

    let den = [1];
    for (let i = 1; i < convRes.length; i++) {
        den.push(convRes[i].re);
    }

    let num = new Array(poles.length + 1).fill(0);
    num[0] = Math.pow(Omega_c, poles.length);
    
    const gain = num[0] / den[0];
    num = num.map(c => c / gain);
    return { num: num, den : den };
}

export const getCausalButterworthPoles = (N, Omega_c) => { // N = Filter Order
    let s_k = [];
    for (let k = 0; k < 2 * N; k++) {
        let tmp = (Math.PI) / (2 * N) * (N + 2 * k - 1);
        s_k.push(complex(Omega_c * Math.cos(tmp), Omega_c * Math.sin(tmp)));
    }
    return s_k.filter(e => e.re < 0);
}

export const H_of_s = (poles, Omega_c, type) => {
    let convRes = [];
    let tmp = [];
    for (let i = 0; i < poles.length; i++) {
        tmp.push([1, complex(-poles[i].re, -poles[i].im)]);
    }

    let tmp2 = tmp[0];
    for (let i = 1; i < tmp.length; i++) {
        tmp2 = convolve(tmp2, tmp[i]);
    }
    convRes = tmp2;
    let den = [1];
    for (let i = 1; i < convRes.length; i++) {
        den.push(convRes[i].re);
    }

    const tf = { num: [Math.pow(Omega_c, poles.length)], den: den };
    switch (type) {
        case filterType.LOWPASS:
            return tf;
        case filterType.HIGHPASS:
            return transformAnalogLowpassToHighpass(poles, Omega_c);
    }
}

export const countNumberOfOccurrences = (str, c) => {
    return str.split(c).length-1;
}

export const eulers_integration = () => {
    return ;
}

export const lowPassImpulseResponse = (cutOffFreq, N = 1024) => {
        let array = new Array(N).fill(0);
        for (let i = 0; i < N; i++) {
            if (i == N / 2) array[i] = cutOffFreq / Math.PI;
            else array[i] = 1 / (Math.PI * (i - (N / 2))) * Math.sin(cutOffFreq * (i - N / 2));
        }
        return array;
    }

export const bandpassImpulseResponse = (w1, w2, N = 1024) => {
    let array = new Array(N).fill(0);
    const mid = Math.floor(N / 2); // Math.floor() is necessary to make it work for both odd and even Ns

    for (let i = 0; i < N; i++) {
        const k = i - mid;
        if (k == 0) {
            array[i] = (w2 - w1) / Math.PI;
        } else {
            array[i] = (Math.sin(w2 * k) - Math.sin(w1 * k)) / (Math.PI * k);
        }
    }

    return array;
};


export const elementWiseAdd = (arr1, arr2) => {
    console.assert(arr1.length == arr2.length);
    let res = new Array(arr1.length);
    for (let i = 0; i < arr1.length; i++) {
        res[i] = arr1[i] + arr2[i];
    }
    return res;
}

export const elementWiseMultiply = (arr1, arr2) => {
    console.assert(arr1.length == arr2.length);
    let res = new Array(arr1.length);
    for (let i = 0; i < arr1.length; i++) {
        res[i] = arr1[i] * arr2[i];
    }
    return res;
}

export const multiplyArrayByAConstant = (arr, constant) => {
    let res = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        res[i] = constant * arr[i];
    }
    return res;
}

export const Hamming = (M) => {
    let array = new Array(M);
    for (let i = 0; i < M; i++) {
        array[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (M - 1))
    }
    return array;
}

export const Bartlett = (M) => {
    let array = new Array(M);
    for (let i = 0; i < M; i++) {
        array[i] = 1 - (2*Math.abs(i - (M-1)/2))/(M-1);
    }
    return array;

}

export const Han = (M) => {
    let array = new Array(M);
    for (let i = 0; i < M; i++) {
        array[i] = 0.5 * (1 - Math.cos((2*Math.PI*i)/(M-1)));
    }
    return array;
}

export const leastSquares_linearPhaseFIR = (F, A, N) => {
    const L = 4098;
    const M = (N-1)/2;
    let normalizedFreqs = Array.from({length: L+1}, (_, i) => i / L);
    let w = multiplyArrayByAConstant(normalizedFreqs, Math.PI);
    let D = Array(L+1).fill(0);

    for(let k = 0; k < F.length/2; k++) {
        let f1 = F[k*2];
        let f2 = F[k*2+1];
        let A1 = A[k*2];
        let A2 = A[k*2+1];

        for (let i = 0; i <= L; i++) {
            if (normalizedFreqs[i] >= f1 && normalizedFreqs[i] <= f2) {
                D[i] = A1 + (A2 - A1) * (normalizedFreqs[i] - f1) / (f2 - f1);
            }
        }
    }

    // Build cosine matrix
    const C = [];
    for (let i = 0; i <= L; i++) {
        const row = [];
        for (let k = 0; k <= M; k++) {
            row.push(Math.cos(w[i] * k));
        }
        C.push(row);
    }
    
    const a = multiply(pinv(multiply(transpose(C), C)), multiply(transpose(C), D));

    const h = new Array(N).fill(0);
    h[M] = a[0];
    for (let k = 1; k <= M; k++) {
        h[M - k] = a[k] / 2;
        h[M + k] = a[k] / 2;
    }

    return h;
};
