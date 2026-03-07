import { ShieldAlert, Zap, Server, Activity } from 'lucide-react';

export default function About() {
    return (
        <div className="reveal-up max-w-4xl mx-auto space-y-12">

            <header className="mb-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00ff88]/10 mb-8 border border-[#00ff88]/30 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
                    <ShieldAlert className="text-[#00ff88]" size={40} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-widest text-white uppercase mb-4 drop-shadow-md">
                    <span className="text-[#00b8ff]">System</span> Protocol
                </h1>
                <p className="text-[#94a3b8] font-mono uppercase tracking-wider text-sm max-w-2xl mx-auto">
                    Declassifying the thermodynamic cost of artificial cognition.
                </p>
            </header>

            <div className="space-y-6">
                {/* Why Carbon Matters section */}
                <section className="neo-glass p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff88]/5 rounded-full blur-[80px] -z-10 group-hover:bg-[#00ff88]/10 transition-colors"></div>

                    <h2 className="text-sm font-bold text-[#00ff88] uppercase tracking-[0.2em] mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                        <Server size={18} /> Physical Infrastructure Impact
                    </h2>

                    <div className="space-y-6 text-[#94a3b8] font-mono text-sm leading-relaxed">
                        <p>
                            <span className="text-white font-bold">THE ILLUSION OF THE CLOUD:</span> Every inference request triggers an orchestrated cascade across hyper-scale data centers. GPUs consuming thousands of watts, cooling towers evaporating millions of gallons, and power grids burning fossil fuels to meet peak demand.
                        </p>
                        <p className="bg-black/40 p-5 rounded-lg border border-white/5">
                            <span className="text-[#00b8ff] block mb-2">Global Payload Scale</span>
                            Current estimates indicate humanity submits <strong className="text-white">50+ billion inference requests</strong> globally per day across all Foundation Models. While a single prompt’s thermodynamic impact is negligible, the macro-scale execution creates a massive invisible carbon footprint.
                        </p>
                    </div>
                </section>

                {/* Calculation Metrics section */}
                <section className="neo-glass p-8 bg-gradient-to-br from-black/60 to-transparent">
                    <h2 className="text-sm font-bold text-[#00b8ff] uppercase tracking-[0.2em] mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
                        <Activity size={18} /> Telemetry Algorithms
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-black/50 p-5 rounded-xl border border-white/5 hover:border-[#00ff88]/30 transition-colors">
                            <div className="text-[10px] text-[#00ff88] font-black uppercase tracking-widest mb-2">Phase 01</div>
                            <h3 className="text-white font-bold uppercase tracking-wider mb-2 text-sm">Token Extraction</h3>
                            <p className="text-[#94a3b8] text-xs font-mono">
                                Linear heuristic applied: <span className="text-white">1 TOK ≈ 4 CHAR</span>. Scales dynamically with payload density.
                            </p>
                        </div>

                        <div className="bg-black/50 p-5 rounded-xl border border-white/5 hover:border-[#00b8ff]/30 transition-colors">
                            <div className="text-[10px] text-[#00b8ff] font-black uppercase tracking-widest mb-2">Phase 02</div>
                            <h3 className="text-white font-bold uppercase tracking-wider mb-2 text-sm">Energy Profiling</h3>
                            <p className="text-[#94a3b8] text-xs font-mono">
                                Model specific <span className="text-white">Power Draw [Wh]</span> per 1k input tokens, derived from PUE (Power Usage Effectiveness) analysis.
                            </p>
                        </div>

                        <div className="bg-black/50 p-5 rounded-xl border border-white/5 hover:border-white/30 transition-colors">
                            <div className="text-[10px] text-white font-black uppercase tracking-widest mb-2">Phase 03</div>
                            <h3 className="text-white font-bold uppercase tracking-wider mb-2 text-sm">Grid Intensity</h3>
                            <p className="text-[#94a3b8] text-xs font-mono">
                                Translating Watt-Hours to Mass using US Average baseline: <span className="text-white">386 gCO₂/kWh</span>.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-[#00ff88]/30 bg-[#00ff88]/5 relative shadow-[0_0_20px_rgba(0,255,136,0.05)]">
                        <code className="text-[#00ff88] block mb-2 text-xs font-bold uppercase tracking-widest">Master Equation</code>
                        <div className="font-mono text-sm tracking-wider text-white">
                            <span className="text-[#ff3366]">CO2_MASS_g</span> = [ <span className="text-[#00b8ff]">TOKENS</span> / 1000 * <span className="text-yellow-400">RTE_Wh</span> ] * 0.386
                        </div>
                    </div>
                </section>

                {/* Actionable Insights */}
                <section className="neo-glass p-8">
                    <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                        <Zap size={18} className="text-yellow-400" /> Optimization Directives
                    </h2>

                    <div className="space-y-4 font-mono text-sm pl-2">
                        <div className="p-5 bg-black/30 border-l-2 border-[#00ff88] hover:bg-white/5 transition-colors">
                            <strong className="text-white block uppercase tracking-wider text-xs mb-2">Directive A: Architecture Downsizing</strong>
                            <span className="text-[#94a3b8]">Deploy minimal viable intelligence. Prevent routing generic data-extraction prompts to heavy nodes (GPT-5.3, Llama 4 1T). Route to efficient nodes (Gemini Flash, Haiku).</span>
                        </div>

                        <div className="p-5 bg-black/30 border-l-2 border-[#00b8ff] hover:bg-white/5 transition-colors">
                            <strong className="text-white block uppercase tracking-wider text-xs mb-2">Directive B: Redundant Call Intercept</strong>
                            <span className="text-[#94a3b8]">Implement semantic caching at the edge. Drop redundant API queries instantly before hitting inference clusters.</span>
                        </div>

                        <div className="p-5 bg-black/30 border-l-2 border-[#ff3366] hover:bg-white/5 transition-colors">
                            <strong className="text-white block uppercase tracking-wider text-xs mb-2">Directive C: Context Compression</strong>
                            <span className="text-[#94a3b8]">Shrink RAG (Retrieval-Augmented Generation) payloads. Injecting irrelvant documents directly increases thermodynamic waste linearly. Filter context dynamically prior to inference.</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
