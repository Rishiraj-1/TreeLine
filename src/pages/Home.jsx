import { useState, useMemo, useEffect } from 'react';
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
    const [extensionStats, setExtensionStats] = useState(null);

    // Fetch live draft prompt from the active tab when popup opens
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const tab = tabs[0];
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, { type: 'GET_CURRENT_INPUT' }, (response) => {
                        if (chrome.runtime.lastError) {
                            // Content script might not be injected on this page (e.g. not an AI tool)
                            console.log("Not an active AI chat page or script not loaded.");
                        } else if (response && response.text) {
                            setPrompt(response.text.trim());

                            // Try to guess default model based on the URL the user is currently on!
                            if (tab.url.includes('chatgpt.com')) setSelectedModel('GPT-5.0 Turbo');
                            if (tab.url.includes('claude.ai')) setSelectedModel('Claude 4.6 Sonnet');
                            if (tab.url.includes('gemini.google.com')) setSelectedModel('Gemini 2.5 Pro');
                        }
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['totalTokens', 'history'], (result) => {
                if (result.totalTokens) {
                    setExtensionStats(result);
                }
            });

            // Listen for updates
            const listener = (changes, namespace) => {
                if (namespace === 'local' && changes.totalTokens) {
                    chrome.storage.local.get(['totalTokens', 'history'], (res) => setExtensionStats(res));
                }
            };
            chrome.storage.onChanged.addListener(listener);
            return () => chrome.storage.onChanged.removeListener(listener);
        }
    }, []);

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
        <div className="reveal-up space-y-4">

            {/* Hero Section */}
            <header className="text-center py-2 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-gradient-to-r from-[#00ff88]/10 to-[#00b8ff]/10 blur-[60px] -z-10 rounded-[100%]"></div>

                {extensionStats && (
                    <div className="mb-4 flex justify-center reveal-up">
                        <div className="neo-glass px-4 py-2 rounded-xl flex gap-4 items-center border border-[#00ff88]/50 bg-[#00ff88]/10 shadow-[0_0_15px_rgba(0,255,136,0.15)]">
                            <div>
                                <span className="text-[#94a3b8] block text-[9px] uppercase font-bold tracking-widest mb-0.5">Live Tokens</span>
                                <span className="font-mono text-white text-sm">{extensionStats.totalTokens.toLocaleString()}</span>
                            </div>
                            <div className="h-6 w-px bg-white/10"></div>
                            <div>
                                <span className="text-[#00ff88] block text-[9px] uppercase font-bold tracking-widest mb-0.5">Est. Emissions</span>
                                <span className="font-mono text-[#00ff88] text-sm drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]">
                                    {fmt((extensionStats.totalTokens / 1000) * 0.004 * 0.386, 2)}g CO₂
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {!extensionStats && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Activity size={12} className="animate-pulse" /> Extension Active
                    </div>
                )}

                <h1 className="text-2xl font-black tracking-tighter mb-2">
                    Calculate <span className="text-gradient">AI Scale</span><br />
                    Optimize <span className="text-gradient-brand">Emissions.</span>
                </h1>
                <p className="text-[#94a3b8] text-xs max-w-[90%] mx-auto font-light leading-relaxed">
                    The ultimate carbon profiler for Next-Gen Foundation Models. Type your inference prompt to analyze the hidden environmental cost and discover hyper-efficient alternatives.
                </p>
            </header>

            <div className="flex flex-col gap-4">

                {/* Main Terminal */}
                <section className="neo-glass flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="p-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-white flex items-center gap-2 tracking-widest uppercase">
                            <Cpu size={14} className="text-[#00ff88]" /> Inference Matrix
                        </h2>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>

                    <div className="p-3 flex flex-col gap-3">
                        <div className="relative">
                            <textarea
                                className="neo-input min-h-[90px] resize-none font-mono text-xs leading-relaxed py-2 px-3"
                                placeholder=">> Initialize inference prompt..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                spellCheck="false"
                            />
                            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[#00ff88]/50 bg-black/60 px-2 py-0.5 rounded border border-[#00ff88]/20">
                                {prompt.length > 0 ? `~${estimateTokens(prompt).toLocaleString()} TOKENS` : 'AWAITING_'}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                            <div className="w-full">
                                <label className="block text-[9px] uppercase tracking-widest text-[#94a3b8] mb-1 font-bold ml-1">
                                    Target Architecture
                                </label>
                                <div className="relative">
                                    <select
                                        className="neo-input cursor-pointer appearance-none text-white/90 font-bold text-[11px] py-1.5 px-3 h-8"
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
                                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#00ff88] text-[10px]">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <button
                                className="neo-btn w-full h-[36px] flex items-center justify-center gap-2 text-xs"
                                onClick={handleCalculate}
                                disabled={!prompt.trim()}
                            >
                                EXECUTE <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Quick Select Panel */}
                <aside className="neo-glass flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-white/5 bg-black/20 flex items-center justify-between cursor-pointer" onClick={() => document.getElementById('protocol-lib').classList.toggle('hidden')}>
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 tracking-widest uppercase hover:text-[#00b8ff] transition-colors">
                            <ZapOff size={14} className="text-[#00b8ff]" /> Protocol Library
                        </h3>
                        <span className="text-[10px] text-[#94a3b8]">▼</span>
                    </div>

                    <div id="protocol-lib" className="hidden p-2 overflow-y-auto max-h-[160px] space-y-2 custom-scrollbar border-t border-black/20">
                        {EXAMPLES.map((ex, idx) => (
                            <button
                                key={idx}
                                className="w-full text-left p-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-[#00b8ff]/10 hover:border-[#00b8ff]/30 transition-all group relative overflow-hidden"
                                onClick={() => {
                                    setPrompt(ex.text);
                                    document.getElementById('protocol-lib').classList.add('hidden');
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00b8ff]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <p className="text-[#00b8ff] font-bold text-[9px] tracking-widest uppercase mb-1">
                                    [{ex.label}]
                                </p>
                                <p className="text-[10px] text-[#94a3b8] font-mono leading-relaxed line-clamp-2">
                                    {ex.text}
                                </p>
                            </button>
                        ))}
                    </div>
                </aside>

            </div>

            {/* Results HUD */}
            {result && (
                <div key={`res-${animKey}`} className="reveal-up neo-glass p-1 overflow-hidden mt-6 bg-gradient-to-b from-[#00ff88]/20 to-transparent">
                    <div className="bg-[#0a110e] rounded-[16px] p-4 relative">
                        <div className="absolute top-0 right-4 w-px h-12 bg-gradient-to-b from-[#00ff88] to-transparent"></div>

                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <h2 className="text-sm font-black text-white tracking-widest uppercase mb-1">Diagnostic Scan Complete</h2>
                                <p className="text-[#00ff88] font-mono text-[10px]">MODEL RUN: {result.name} /// STATUS: ACTIVE</p>
                            </div>

                            {greenest && greenest.name !== result.name && (
                                <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 px-3 py-2 rounded-lg flex items-center gap-3 animate-pulse">
                                    <div className="h-6 w-6 shrink-0 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                                        <Zap size={12} />
                                    </div>
                                    <p className="text-[10px] font-bold text-white leading-tight">
                                        <span className="text-[#00ff88]">OPTIMIZATION AVAILABLE</span><br />
                                        Use {greenest.name} to save {((1 - greenest.co2 / result.co2) * 100).toFixed(0)}% energy.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Core Metrics */}
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="neo-stat rounded-lg p-2 border border-white/5">
                                <p className="text-[8px] text-[#94a3b8] uppercase tracking-widest font-bold mb-1">Payload Volume</p>
                                <p className="text-[11px] font-black text-white font-mono break-all">
                                    {result.tokens.toLocaleString()} <span className="text-[9px] text-[#00b8ff] font-sans">TOK</span>
                                </p>
                            </div>

                            <div className="neo-stat rounded-lg p-2 border border-white/5">
                                <p className="text-[8px] text-[#94a3b8] uppercase tracking-widest font-bold mb-1">Power Draw</p>
                                <p className="text-[11px] font-black text-white font-mono break-all">
                                    {fmt(result.energy, 4)} <span className="text-[9px] text-yellow-400 font-sans">Wh</span>
                                </p>
                            </div>

                            <div className="neo-stat rounded-lg p-2 border border-[#00ff88]/30 bg-[#00ff88]/5 neo-glow">
                                <p className="text-[8px] text-[#00ff88] uppercase tracking-widest font-bold mb-1">Carbon Mass</p>
                                <p className="text-xs font-black text-white font-mono drop-shadow-[0_0_10px_rgba(0,255,136,0.6)] break-all">
                                    {fmt(result.co2, 4)} <span className="text-[10px] text-[#00ff88] font-sans">g</span>
                                </p>
                            </div>
                        </div>

                        {/* Equivalent Cards */}
                        <h3 className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-bold mb-3 border-b border-white/10 pb-1">Physical World Equivalents</h3>
                        <div className="grid grid-cols-1 gap-2 mb-6">
                            {result.comparisons.map((c, i) => (
                                <div key={i} className="bg-black/30 border border-white/5 rounded-lg p-3 flex items-center justify-between hover:bg-black/50 hover:border-[#00b8ff]/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl">{c.emoji}</div>
                                        <div>
                                            <div className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-bold">
                                                {c.label}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-black text-white font-mono text-right">
                                        {c.value}<span className="text-[9px] text-[#00b8ff] ml-1 font-sans">{c.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Smooth Area Chart */}
                        <div className="neo-glass p-3 bg-black/40 border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[10px] text-white uppercase tracking-widest font-bold flex items-center gap-2">
                                    <Activity size={12} className="text-[#00ff88]" /> Topology vs Carbon
                                </h3>
                            </div>
                            <div className="h-[140px] w-full">
                                <ResponsiveContainer width="100%" height={140}>
                                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }}
                                            angle={-45}
                                            textAnchor="end"
                                            tickMargin={5}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: '#94a3b8', fontSize: 8, fontFamily: 'monospace' }}
                                            tickFormatter={(val) => parseFloat(val).toExponential(1)}
                                            axisLine={false}
                                            tickLine={false}
                                            width={40}
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
