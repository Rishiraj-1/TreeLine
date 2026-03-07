import { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { MODELS, EXAMPLES } from '../utils/models';
import { estimateTokens, calcEnergy, calcCO2, fmt } from '../utils/calculations';
import { Network, Database } from 'lucide-react';

/* ─── Ultra Futuristic Tooltip ─── */
function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="neo-glass p-3 border border-[#00b8ff]/30 shadow-[0_0_20px_rgba(0,184,255,0.15)] z-50">
            <p className="font-bold text-[#00b8ff] mb-1 tracking-widest text-[10px] uppercase flex items-center gap-2">
                {d.family} // {d.name}
            </p>
            <div className="space-y-1 font-mono">
                <div className="flex justify-between gap-4 text-xs">
                    <span className="text-[#94a3b8]">VAR_CO2:</span>
                    <span className="text-white font-bold">{fmt(d.co2, 6)}g</span>
                </div>
                <div className="flex justify-between gap-4 text-xs">
                    <span className="text-[#94a3b8]">VAR_NRG:</span>
                    <span className="text-white font-bold">{fmt(d.energy, 6)}Wh</span>
                </div>
                <div className="flex justify-between gap-4 text-xs pt-1 border-t border-white/10 mt-1">
                    <span className="text-[#94a3b8]">EFF_RTE:</span>
                    <span className="text-[#00ff88]">{d.whPer1k}</span>
                </div>
            </div>
        </div>
    );
}

export default function Leaderboard() {
    const [prompt, setPrompt] = useState(EXAMPLES[2].text);
    const [familyFilter, setFamilyFilter] = useState('All');

    const families = ['All', ...new Set(MODELS.map(m => m.family))];

    const comparisonData = useMemo(() => {
        const tokens = estimateTokens(prompt);
        return MODELS.map((m) => {
            const energy = calcEnergy(tokens, m.whPer1k);
            const co2 = calcCO2(energy);
            return { ...m, tokens, energy, co2 };
        });
    }, [prompt]);

    const filteredData = useMemo(() => {
        let data = [...comparisonData];
        if (familyFilter !== 'All') {
            data = data.filter(m => m.family === familyFilter);
        }
        return data.sort((a, b) => a.co2 - b.co2);
    }, [comparisonData, familyFilter]);

    const greenest = filteredData.length > 0 ? filteredData[0] : null;
    const mostExpensive = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

    return (
        <div className="reveal-up space-y-10">

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-widest text-white uppercase mb-4 flex items-center gap-4">
                        <Network className="text-[#00b8ff]" size={40} /> Global Leaderboard
                    </h1>
                    <p className="text-[#94a3b8] font-mono text-sm uppercase tracking-wider max-w-2xl border-l-2 border-[#00b8ff] pl-4">
                        System-wide analysis of {MODELS.length} Foundation Models. Ranking established by energy extraction metrics.
                    </p>
                </div>
            </header>

            {/* Control Panel */}
            <section className="neo-glass p-6 md:p-8 flex flex-col md:flex-row gap-8 bg-black/40 border-[#00b8ff]/20">
                <div className="flex-grow w-full">
                    <label className="block text-[10px] text-[#00b8ff] uppercase tracking-[0.2em] mb-3 font-bold">Simulated Load Data</label>
                    <input
                        type="text"
                        className="neo-input font-mono text-sm"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        spellCheck="false"
                    />
                    <div className="flex justify-between mt-3 text-xs font-mono text-[#94a3b8]">
                        <span>L_DATA_SIZE</span>
                        <span className="text-[#00ff88]">~{estimateTokens(prompt).toLocaleString()} TOKENS</span>
                    </div>
                </div>

                <div className="w-full md:w-72 shrink-0">
                    <label className="block text-[10px] text-[#00b8ff] uppercase tracking-[0.2em] mb-3 font-bold">Filter By Node</label>
                    <div className="relative">
                        <select
                            className="neo-input cursor-pointer appearance-none font-black tracking-wider uppercase text-white"
                            value={familyFilter}
                            onChange={(e) => setFamilyFilter(e.target.value)}
                        >
                            {families.map(f => (
                                <option key={f} value={f} className="bg-[#0a110e]">{f === 'All' ? 'GLOBAL NETWORK' : `${f} CLUSTER`}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#00b8ff]">
                            ▼
                        </div>
                    </div>
                </div>
            </section>

            {/* Bar Chart Dashboard */}
            <section className="neo-glass p-6 md:p-8 bg-black/20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b8ff]/5 rounded-full blur-[80px] group-hover:bg-[#00b8ff]/10 transition-colors"></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Database size={16} className="text-[#00ff88]" /> Array Visualization
                </h3>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData} margin={{ top: 20, right: 20, bottom: 90, left: 30 }}>
                            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                tickMargin={10}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                                tickFormatter={(val) => parseFloat(val).toExponential(1)}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: 'CO2(g)', angle: -90, position: 'insideLeft', fill: '#00b8ff', fontSize: 10, fontFamily: 'monospace' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="co2" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                {filteredData.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={
                                            entry.name === greenest?.name ? '#00ff88' :
                                                entry.name === mostExpensive?.name ? '#ff3366' :
                                                    '#00b8ff'
                                        }
                                        fillOpacity={entry.name === greenest?.name || entry.name === mostExpensive?.name ? 1 : 0.6}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Technical Data Table */}
            <section className="neo-glass overflow-hidden border-[#00ff88]/20 relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#00ff88] to-[#00b8ff]"></div>
                <div className="p-6 bg-black/40 border-b border-white/5 pl-8">
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Raw Diagnostic Output</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-black/80 font-mono text-[10px]">
                                <th className="text-left py-4 px-6 text-[#94a3b8] border-b border-white/5">IDX</th>
                                <th className="text-left py-4 px-6 text-[#94a3b8] border-b border-white/5">NODE_IDENTIFIER</th>
                                <th className="text-left py-4 px-6 text-[#94a3b8] border-b border-white/5">CLUSTER</th>
                                <th className="text-right py-4 px-6 text-[#94a3b8] border-b border-white/5">RTE (Wh/1k)</th>
                                <th className="text-right py-4 px-6 text-[#94a3b8] border-b border-white/5">PWR_DRAW (Wh)</th>
                                <th className="text-right py-4 px-6 text-[#00ff88] border-b border-white/5">MASS (gCO2)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                            {filteredData.map((m, i) => {
                                const isGreenest = m.name === greenest?.name;
                                const isMostExpensive = m.name === mostExpensive?.name;

                                return (
                                    <tr
                                        key={m.name}
                                        className={`transition-all duration-300 hover:bg-white/5
                      ${isGreenest ? 'bg-[#00ff88]/5' : ''}
                      ${isMostExpensive ? 'bg-[#ff3366]/5' : ''}`}
                                    >
                                        <td className="py-5 px-6 font-bold text-[#94a3b8]">
                                            {String(i + 1).padStart(2, '0')}
                                        </td>
                                        <td className="py-5 px-6 font-bold text-white flex items-center gap-3">
                                            {m.name}
                                            {isGreenest && <span className="px-2 py-0.5 rounded-[4px] text-[9px] uppercase font-black bg-[#00ff88] text-black tracking-widest shadow-[0_0_10px_rgba(0,255,136,0.5)]">Apex</span>}
                                            {isMostExpensive && <span className="px-2 py-0.5 rounded-[4px] text-[9px] uppercase font-black bg-[#ff3366] text-white tracking-widest shadow-[0_0_10px_rgba(255,51,102,0.5)]">Overload</span>}
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className="text-[#00b8ff] text-xs">
                                                {m.family}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right text-[#94a3b8]">
                                            {m.whPer1k.toFixed(4)}
                                        </td>
                                        <td className="py-5 px-6 text-right text-[#94a3b8]">
                                            {fmt(m.energy, 6)}
                                        </td>
                                        <td className="py-5 px-6 text-right font-black text-lg"
                                            style={{ color: isGreenest ? '#00ff88' : isMostExpensive ? '#ff3366' : '#fff' }}>
                                            {fmt(m.co2, 6)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
