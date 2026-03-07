import { CO2_PER_WH } from './models';

// Assuming out tokens are about 1.5x of in tokens for a typical generative usecase to allow mixed logic
export function estimateTokens(text) {
    const inTokens = Math.max(1, Math.ceil(text.length / 4));
    const outTokens = Math.ceil(inTokens * 1.5);
    return { inTokens, outTokens, total: inTokens + outTokens };
}

export function calcEnergy(totalTokens, whPer1k) {
    return (totalTokens / 1000) * whPer1k;
}

export function calcCO2(energyWh) {
    return energyWh * CO2_PER_WH;
}

export function calcCost(inTokens, outTokens, pricePer1kIn, pricePer1kOut) {
    const inCost = (inTokens / 1000) * pricePer1kIn;
    const outCost = (outTokens / 1000) * pricePer1kOut;
    return inCost + outCost;
}

export function getComparisons(co2Grams) {
    return [
        { emoji: '🔋', label: 'Phone charges', value: (co2Grams / 8.22).toFixed(4), unit: '×' },
        { emoji: '🚗', label: 'Miles driven', value: (co2Grams / 404).toFixed(6), unit: 'mi' },
        { emoji: '📺', label: 'Netflix streaming', value: ((co2Grams / 36) * 60).toFixed(4), unit: 'min' },
    ];
}

export function fmt(n, decimals = 6) {
    if (n === null || n === undefined || isNaN(n)) return '0';
    if (n === 0) return '0';
    if (n < 0.000001 && n > 0) return n.toExponential(2);
    return parseFloat(Number(n).toFixed(decimals)).toString();
}
