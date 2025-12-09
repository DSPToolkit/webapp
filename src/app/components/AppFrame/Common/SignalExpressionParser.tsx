const sine = (
    omega: number,
    amplitude: number,
    N: number,
    phase: number = 0
): number[] => {

    if (!Number.isInteger(N) || N < 1)
        throw new Error("N must be an integer >= 1");

    const out = new Array(N);
    for (let n = 0; n < N; n++)
        out[n] = amplitude * Math.sin(omega * n + phase);

    return out;
};

const noise = (
    lower: number,
    upper: number,
    N: number
): number[] => {

    if (!Number.isInteger(N) || N < 1)
        throw new Error("N must be integer >= 1");

    const out = new Array(N);
    const range = upper - lower;

    for (let i = 0; i < N; i++)
        out[i] = lower + Math.random() * range;

    return out;
};

type Func = (...args: number[]) => number[];

const functionCalls: Record<string, { re: RegExp; fn: Func }> = {
    sine: {
        re: /^sin\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)$/,
        fn: sine
    },
    noise: {
        re: /^noise\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)$/,
        fn: noise
    }
};
const evalNumber = (str: string) => {
    const expr = str.replace(/pi/gi, String(Math.PI));
    return Function(`"use strict"; return (${expr})`)();
};


const execCall = (token: string) => {
    for (const { re, fn } of Object.values(functionCalls)) {
        const m = token.match(re);
        if (!m) continue;

        const args = m.slice(1)
            .filter(Boolean)
            .map(a => evalNumber(a.trim()));
            
        fn(...args);
    }
    throw new Error("Unknown call: " + token);
};


const applyOp = (A: number[], B: number[], op: string) => {
    const n = Math.min(A.length, B.length);
    const out = new Array(n);

    for (let i = 0; i < n; i++) {
        switch (op) {
            case "+": out[i] = A[i] + B[i]; break;
            case "-": out[i] = A[i] - B[i]; break;
            case "*": out[i] = A[i] * B[i]; break;
            case "/": out[i] = A[i] / B[i]; break;
        }
    }
    return out;
};

export const signalExprParser = (s: string) => {
    const tokens = s.match(
        /[a-zA-Z_]\w*\s*\([^()]*\)|[+*/]|-/g
    );

    let res = null;
    let operator = null;

    for (const t of tokens) {
        if (/^[+*/-]$/.test(t)) {
            operator = t;
            continue;
        }

        const val = execCall(t);

        if (res === null) res = val;
        else {
            res = applyOp(res, val, operator);
            operator = null;
        }
    }

    return res;
};
