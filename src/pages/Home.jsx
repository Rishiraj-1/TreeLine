import { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { MODELS, EXAMPLES } from '../utils/models';
import { estimateTokens, calcEnergy, calcCO2, getComparisons, fmt } from '../utils/calculations';
import { Activity, Zap, Cpu, ArrowRight, ZapOff } from 'lucide-react';

/* ─── Ultra Futuristic Tooltip ─── */
function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="neo-glass p-4 border border-[#00ff88]/30 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
            <p className="font-bold text-[#00ff88] mb-2 tracking-widest text-xs uppercase flex items-center gap-2">
                <Zap size={14} /> {d.name}
            </p>
            <div className="space-y-1">
                <div className="flex justify-between gap-6 text-sm">
                    <span className="text-[#94a3b8]">Emissions:</span>
                    <span className="font-mono text-white">{fmt(d.co2, 4)} g</span>
                </div>
                <div className="flex justify-between gap-6 text-sm">
                    <span className="text-[#94a3b8]">Power Draw:</span>
                    <span className="font-mono text-white">{fmt(d.energy, 4)} Wh</span>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState(MODELS[0].name);
    const [result, setResult] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [session, setSession] = useState({ count: 0, totalCO2: 0, totalEnergy: 0 });
    const [animKey, setAnimKey] = useState(0);

    const handleCalculate = () => {
        if (!prompt.trim()) return;

        const tokens = estimateTokens(prompt);
        const allModels = MODELS.map((m) => {
            const energy = calcEnergy(tokens, m.whPer1k);
            const co2 = calcCO2(energy);
            return { ...m, tokens, energy, co2 };
        });

        const selected = allModels.find((m) => m.name === selectedModel);
        const comparisons = getComparisons(selected.co2);

        setResult({ ...selected, comparisons });
        setComparisonData(allModels);

        setSession((s) => ({
            count: s.count + 1,
            totalCO2: s.totalCO2 + selected.co2,
            totalEnergy: s.totalEnergy + selected.energy,
        }));
        setAnimKey((k) => k + 1);
    };

    const greenest = useMemo(
        () => comparisonData && comparisonData.reduce((a, b) => (a.co2 < b.co2 ? a : b)),
        [comparisonData]
    );

    const chartData = useMemo(
        () => comparisonData && [...comparisonData].sort((a, b) => a.co2 - b.co2),
        [comparisonData]
    );

    return (
        <div className="reveal-up space-y-12">

            {/* Hero Section */}
            <header className="text-center py-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#00ff88]/10 to-[#00b8ff]/10 blur-[100px] -z-10 rounded-[100%]"></div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-xs font-bold uppercase tracking-widest mb-6">
                    <Activity size={14} className="animate-pulse" /> Live Telemetry
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
                    Calculate <span className="text-gradient">AI Scale</span><br />
                    Optimize <span className="text-gradient-brand">Emissions.</span>
                </h1>
                <p className="text-[#94a3b8] text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    The ultimate carbon profiler for Next-Gen Foundation Models. Type your inference prompt to analyze the hidden environmental cost and discover hyper-efficient alternatives.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Terminal (Left Column) */}
                <section className="lg:col-span-8 neo-glass flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3 tracking-widest uppercase">
                            <Cpu size={20} className="text-[#00ff88]" /> Inference Matrix
                        </h2>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col gap-6">
                        <div className="relative">
                            <textarea
                                className="neo-input min-h-[240px] resize-y font-mono text-sm xl:text-base leading-relaxed"
                                placeholder=">> Initialize inference prompt..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                spellCheck="false"
                            />
                            <div className="absolute bottom-4 right-4 text-xs font-mono text-[#00ff88]/50 bg-black/40 px-3 py-1 rounded border border-[#00ff88]/20">
                                {prompt.length > 0 ? `~${estimateTokens(prompt).toLocaleString()} TOKENS` : 'AWAITING INPUT_'}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-end bg-black/30 p-4 rounded-2xl border border-white/5">
                            <div className="flex-1 w-full">
                                <label className="block text-xs uppercase tracking-widest text-[#94a3b8] mb-2 font-bold ml-1">
                                    Target Architecture
                                </label>
                                <div className="relative">
                                    <select
                                        className="neo-input cursor-pointer appearance-none text-white/90 font-bold"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                    >
                                        {['OpenAI', 'Anthropic', 'Google', 'Meta', 'DeepSeek'].map(family => (
                                            <optgroup key={family} label={`>> ${family} CLUSTER`} className="bg-[#0a110e] text-[#00b8ff]">
                                                {MODELS.filter(m => m.family === family).map(m => (
                                                    <option key={m.name} value={m.name} className="text-white">{m.name}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#00ff88]">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <button
                                className="neo-btn w-full sm:w-auto h-[56px] flex items-center justify-center gap-2"
                                onClick={handleCalculate}
                                disabled={!prompt.trim()}
                            >
                                EXECUTE <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Quick Select Panel (Right Column) */}
                <aside className="lg:col-span-4 neo-glass flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-black/20">
                        <h3 className="text-lg font-bold text-white flex items-center gap-3 tracking-widest uppercase">
                            <ZapOff size={20} className="text-[#00b8ff]" /> Protocol Library
                        </h3>
                    </div>

                    <div className="p-4 overflow-y-auto max-h-[440px] space-y-3 custom-scrollbar">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={idx}
                                className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#00b8ff]/10 hover:border-[#00b8ff]/30 transition-all group group relative overflow-hidden"
                                onClick={() => setPrompt(ex.text)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00b8ff]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <p className="text-[#00b8ff] font-bold text-sm tracking-widest uppercase mb-2">
                                    [{ex.label}]
                                </p>
                                <p className="text-xs text-[#94a3b8] font-mono leading-relaxed line-clamp-3">
                                    {ex.text}
                                </p>
                            </button>
                        ))}
                    </div>
                </aside>

            </div>

            {/* Results HUD */}
            {result && (
                <div key={`res-${animKey}`} className="reveal-up neo-glass p-1 overflow-hidden mt-12 bg-gradient-to-b from-[#00ff88]/20 to-transparent">
                    <div className="bg-[#0a110e] rounded-[22px] p-6 md:p-10 relative">
                        <div className="absolute top-0 right-10 w-px h-20 bg-gradient-to-b from-[#00ff88] to-transparent"></div>

                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">Diagnostic Scan Complete</h2>
                                <p className="text-[#00ff88] font-mono">MODEL RUN: {result.name} /// STATUS: ACTIVE</p>
                            </div>

                            {greenest && greenest.name !== result.name && (
                                <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 px-6 py-4 rounded-xl flex items-center gap-4 max-w-md animate-pulse">
                                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                                        <Zap size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-white">
                                        <span className="text-[#00ff88]">OPTIMIZATION AVAILABLE</span><br />
                                        Use {greenest.name} to save {((1 - greenest.co2 / result.co2) * 100).toFixed(0)}% energy.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Core Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="neo-stat rounded-xl border border-white/5">
                                <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.2em] font-bold mb-2">Payload Volume</p>
                                <p className="text-4xl font-black text-white font-mono">
                                    {result.tokens.toLocaleString()} <span className="text-xl text-[#00b8ff] font-sans">TOK</span>
                                </p>
                            </div>

                            <div className="neo-stat rounded-xl border border-white/5">
                                <p className="text-[10px] text-[#94a3b8] uppercase tracking-[0.2em] font-bold mb-2">Power Draw</p>
                                <p className="text-4xl font-black text-white font-mono">
                                    {fmt(result.energy, 4)} <span className="text-xl text-yellow-400 font-sans">Wh</span>
                                </p>
                            </div>

                            <div className="neo-stat rounded-xl border border-[#00ff88]/30 bg-[#00ff88]/5 neo-glow">
                                <p className="text-[10px] text-[#00ff88] uppercase tracking-[0.2em] font-bold mb-2">Carbon Mass</p>
                                <p className="text-5xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]">
                                    {fmt(result.co2, 4)} <span className="text-2xl text-[#00ff88] font-sans">g</span>
                                </p>
                            </div>
                        </div>

                        {/* Equivalent Cards */}
                        <h3 className="text-sm text-[#94a3b8] uppercase tracking-[0.2em] font-bold mb-6 border-b border-white/10 pb-2">Physical World Equivalents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {result.comparisons.map((c, i) => (
                                <div key={i} className="bg-black/30 border border-white/5 rounded-2xl p-6 flex items-center gap-6 hover:bg-black/50 hover:border-[#00b8ff]/30 transition-colors">
                                    <div className="text-4xl">{c.emoji}</div>
                                    <div>
                                        <div className="text-2xl font-black text-white font-mono">
                                            {c.value}<span className="text-sm text-[#00b8ff] ml-2 font-sans">{c.unit}</span>
                                        </div>
                                        <div className="text-[11px] text-[#94a3b8] uppercase tracking-widest font-bold mt-1">
                                            {c.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Smooth Area Chart */}
                        <div className="neo-glass p-6 md:p-8 bg-black/40 border border-white/5">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm text-white uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                                    <Activity size={16} className="text-[#00ff88]" /> Topology vs Carbon (gCO₂)
                                </h3>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                                        <defs>
                                            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                                            angle={-45}
                                            textAnchor="end"
                                            tickMargin={10}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                                            tickFormatter={(val) => parseFloat(val).toExponential(1)}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="co2"
                                            stroke="#00ff88"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorCo2)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
