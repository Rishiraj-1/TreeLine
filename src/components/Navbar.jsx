import { Link, useLocation } from 'react-router-dom';
import { Leaf, Cpu, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        { name: 'Terminal', path: '/', icon: <Sparkles size={18} /> },
        { name: 'Batch Process', path: '/batch', icon: <Layers size={18} /> },
        { name: 'Telemetry', path: '/leaderboard', icon: <Cpu size={18} /> },
        { name: 'Protocol', path: '/about', icon: <ShieldAlert size={18} /> },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
            <div className="neo-glass pointer-events-auto max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-4">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00b8ff] p-[1px] group-hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition-shadow">
                        <div className="w-full h-full bg-[#0a110e] rounded-full flex items-center justify-center">
                            <Leaf size={20} className="text-[#00ff88]" />
                        </div>
                    </div>
                    <span className="text-xl font-bold tracking-wider text-white">
                        NEXUS<span className="text-gradient-brand">.carbon</span>
                    </span>
                </Link>

                <div className="flex flex-wrap justify-center gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                  ${isActive
                                        ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[rgba(0,255,136,0.2)] shadow-[inset_0_0_20px_rgba(0,255,136,0.05)]'
                                        : 'text-[#94a3b8] hover:text-white hover:bg-[rgba(255,255,255,0.05)] border border-transparent'
                                    }`}
                            >
                                <span className={isActive ? 'text-[#00ff88]' : 'text-[#94a3b8] group-hover:text-white'}>
                                    {item.icon}
                                </span>
                                <span className="hidden sm:inline uppercase tracking-widest text-[11px]">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
