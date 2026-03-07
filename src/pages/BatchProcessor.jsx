import { useState } from 'react';
import { MODELS } from '../utils/models';
import { estimateTokens, calcEnergy, calcCO2, calcCost, fmt } from '../utils/calculations';
import { Layers, Play, RefreshCw, HardDrive, Leaf, Sparkles } from 'lucide-react';

export default function BatchProcessor() {
    const [requestVolume, setRequestVolume] = useState(1000000);
    const [avgPromptLength, setAvgPromptLength] = useState(2500);
    const [currentModel, setCurrentModel] = useState(MODELS[3].name);
    const [targetModel, setTargetModel] = useState(MODELS[11].name);
    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState(null);

    const safeFmt = (val, dec = 2) => {
        const n = Number(val);
        if (!isFinite(n)) return '0';
        return fmt(n, dec);
    };

    const safeMoney = (val) => {
        const n = Number(val);
        if (!isFinite(n)) return '0';
        return Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    const safePercent = (val) => {
        const n = Number(val);
        if (!isFinite(n)) return '0.0';
        return n.toFixed(1);
    };

    const handleSimulate = () => {
        setIsCalculating(true);
        setTimeout(() => {
            try {
                const { inTokens, outTokens, total } = estimateTokens('a'.repeat(avgPromptLength));
                const totalTokensIn = inTokens * requestVolume;
                const totalTokensOut = outTokens * requestVolume;
                const totalTokens = total * requestVolume;

                const m1 = MODELS.find(m => m.name === currentModel);
                const m2 = MODELS.find(m => m.name === targetModel);

                if (!m1 || !m2) { setIsCalculating(false); return; }

                const m1Energy = calcEnergy(totalTokens, m1.whPer1k);
                const m2Energy = calcEnergy(totalTokens, m2.whPer1k);
                const m1Carbon = calcCO2(m1Energy);
                const m2Carbon = calcCO2(m2Energy);
                const m1Cost = calcCost(totalTokensIn, totalTokensOut, m1.pricePer1kIn, m1.pricePer1kOut);
                const m2Cost = calcCost(totalTokensIn, totalTokensOut, m2.pricePer1kIn, m2.pricePer1kOut);

                const carbonPct = m1Carbon > 0 ? (1 - m2Carbon / m1Carbon) * 100 : 0;
                const costPct = m1Cost > 0 ? (1 - m2Cost / m1Cost) * 100 : 0;

                setResults({
                    base: { name: m1.name, cost: m1Cost, carbon: m1Carbon, energy: m1Energy },
                    target: { name: m2.name, cost: m2Cost, carbon: m2Carbon, energy: m2Energy },
                    savings: {
                        cost: m1Cost - m2Cost,
                        carbon: m1Carbon - m2Carbon,
                        energy: m1Energy - m2Energy,
                        carbonPercent: carbonPct,
                        costPercent: costPct
                    }
                });
            } catch (err) {
                console.error('Batch simulation error:', err);
            }
            setIsCalculating(false);
        }, 800);
    };

    return (
        <div className="reveal-up space-y-12">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-widest text-white uppercase mb-4 flex items-center gap-4 drop-shadow-md">
                    <Layers className="text-[#00b8ff]" size={40} /> Enterprise Batch Scaling
                </h1>
                <p className="text-[#94a3b8] font-mono uppercase tracking-wider text-sm max-w-3xl border-l-2 border-[#00b8ff] pl-4 leading-relaxed">
                    Simulate massive-scale API infrastructure. Calculate dual-axis optimization for both financial ROI and total ESG carbon reduction when migrating models.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <section className="lg:col-span-5 neo-glass p-6 md:p-8 bg-black/40">
                    <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
                        <HardDrive size={18} className="text-[#00ff88]" /> Simulation Parameters
                    </h2>

                    <div className="space-y-6">
                        {/* Request Volume Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] text-[#00b8ff] uppercase tracking-[0.2em] font-bold">Annual Request Volume</label>
                                <span className="text-white font-mono text-xs font-bold">{requestVolume.toLocaleString()} REQs</span>
                            </div>
                            <input type="range" min="10000" max="100000000" step="10000"
                                value={requestVolume} onChange={(e) => setRequestVolume(Number(e.target.value))}
                                className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#00b8ff]" />
                        </div>

                        {/* Prompt Size Slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-[10px] text-[#00b8ff] uppercase tracking-[0.2em] font-bold">Avg Prompt Size (Chars)</label>
                                <span className="text-white font-mono text-xs font-bold">{avgPromptLength.toLocaleString()} CHRs</span>
                            </div>
                            <input type="range" min="100" max="100000" step="100"
                                value={avgPromptLength} onChange={(e) => setAvgPromptLength(Number(e.target.value))}
                                className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#00b8ff]" />
                        </div>

                        {/* Model Selectors */}
                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <div>
                                <label className="block text-[10px] text-[#94a3b8] uppercase tracking-[0.2em] font-bold mb-2">Current Legacy Infrastructure</label>
                                <div className="relative">
                                    <select className="neo-input cursor-pointer appearance-none text-white/90 font-bold border-red-500/20 focus:border-red-500 bg-red-500/5"
                                        value={currentModel} onChange={(e) => setCurrentModel(e.target.value)}>
                                        {MODELS.map(m => <option key={m.name} value={m.name} className="bg-[#0a110e]">{m.name}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-red-500">▼</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] text-[#94a3b8] uppercase tracking-[0.2em] font-bold mb-2">Target Optimized Infrastructure</label>
                                <div className="relative">
                                    <select className="neo-input cursor-pointer appearance-none text-white/90 font-bold border-[#00ff88]/30 focus:border-[#00ff88] bg-[#00ff88]/5"
                                        value={targetModel} onChange={(e) => setTargetModel(e.target.value)}>
                                        {MODELS.map(m => <option key={m.name} value={m.name} className="bg-[#0a110e]">{m.name}</option>)}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#00ff88]">▼</div>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleSimulate}
                            disabled={isCalculating || currentModel === targetModel}
                            className="neo-btn w-full mt-8 flex items-center justify-center gap-2 group tracking-widest uppercase border-[#00b8ff]/50 shadow-[0_0_20px_rgba(0,184,255,0.1)] hover:shadow-[0_0_30px_rgba(0,184,255,0.4)] disabled:opacity-30 disabled:cursor-not-allowed">
                            {isCalculating ? (
                                <RefreshCw className="animate-spin text-[#00b8ff]" size={20} />
                            ) : (
                                <>Run Batch Simulation <Play className="group-hover:translate-x-1 transition-transform" size={18} /></>
                            )}
                        </button>
                    </div>
                </section>

                {/* Output Dashboard */}
                <section className="lg:col-span-7">
                    {!results ? (
                        <div className="neo-glass flex flex-col items-center justify-center p-12 text-center min-h-[400px] border-dashed border-white/10">
                            <RefreshCw size={48} className="text-[#94a3b8] opacity-20 mb-4 stroke-1" />
                            <p className="text-[#94a3b8] font-mono text-sm uppercase tracking-widest">
                                System awaiting batch parameters.<br />Define payload geometry and execute simulation.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                            {/* Savings HUD */}
                            <div className={`neo-glass p-8 bg-gradient-to-br relative overflow-hidden ${results.savings.cost >= 0
                                    ? 'from-[#00ff88]/10 to-transparent border-[#00ff88]/40 shadow-[0_0_40px_rgba(0,255,136,0.1)]'
                                    : 'from-red-500/10 to-transparent border-red-500/40 shadow-[0_0_40px_rgba(255,50,50,0.1)]'
                                }`}>
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Leaf size={120} /></div>
                                <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-3 ${results.savings.cost >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
                                    <Sparkles size={16} /> {results.savings.cost >= 0 ? 'Projected Enterprise Savings' : 'Cost Increase Warning'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div>
                                        <p className="text-[#94a3b8] text-[10px] uppercase tracking-widest font-bold mb-1">Financial ROI Offset</p>
                                        <p className="text-5xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(0,184,255,0.4)]">
                                            {results.savings.cost >= 0 ? '' : '-'}${safeMoney(results.savings.cost)}
                                        </p>
                                        <p className={`text-sm font-bold mt-2 ${results.savings.cost >= 0 ? 'text-[#00b8ff]' : 'text-red-400'}`}>
                                            {results.savings.cost >= 0 ? '↓' : '↑'} {safePercent(Math.abs(results.savings.costPercent))}% Cost {results.savings.cost >= 0 ? 'Reduction' : 'Increase'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[#94a3b8] text-[10px] uppercase tracking-widest font-bold mb-1">Total ESG Carbon Offset</p>
                                        <p className="text-5xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(0,255,136,0.4)]">
                                            {safeFmt(Math.abs(results.savings.carbon) / 1000000, 2)} <span className={`text-2xl font-sans ${results.savings.carbon >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>mT</span>
                                        </p>
                                        <p className={`text-sm font-bold mt-2 ${results.savings.carbon >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
                                            {results.savings.carbon >= 0 ? '↓' : '↑'} {safePercent(Math.abs(results.savings.carbonPercent))}% Mass {results.savings.carbon >= 0 ? 'Reduction' : 'Increase'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Legacy vs Target */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="neo-glass p-6 border-red-500/20 bg-black/40">
                                    <h4 className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em] mb-4 border-b border-red-500/10 pb-2">Legacy Base</h4>
                                    <p className="text-lg font-bold text-white mb-6">{results.base.name}</p>
                                    <div className="space-y-4 text-sm font-mono text-[#94a3b8]">
                                        <div className="flex justify-between"><span>OPEX Cost:</span> <span className="text-white">${safeMoney(results.base.cost)}</span></div>
                                        <div className="flex justify-between"><span>Mass (kg):</span> <span className="text-white">{safeFmt(results.base.carbon / 1000)}</span></div>
                                        <div className="flex justify-between"><span>Power Draw:</span> <span className="text-white">{safeFmt(results.base.energy / 1000)} kWh</span></div>
                                    </div>
                                </div>

                                <div className="neo-glass p-6 border-[#00ff88]/30 bg-[#00ff88]/5">
                                    <h4 className="text-[10px] text-[#00ff88] font-bold uppercase tracking-[0.2em] mb-4 border-b border-[#00ff88]/10 pb-2">Optimized Target</h4>
                                    <p className="text-lg font-bold text-white mb-6">{results.target.name}</p>
                                    <div className="space-y-4 text-sm font-mono text-[#94a3b8]">
                                        <div className="flex justify-between"><span>OPEX Cost:</span> <span className="text-white">${safeMoney(results.target.cost)}</span></div>
                                        <div className="flex justify-between"><span>Mass (kg):</span> <span className="text-[#00ff88] font-bold">{safeFmt(results.target.carbon / 1000)}</span></div>
                                        <div className="flex justify-between"><span>Power Draw:</span> <span className="text-[#00ff88] font-bold">{safeFmt(results.target.energy / 1000)} kWh</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
