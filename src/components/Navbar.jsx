import { Link, useLocation } from 'react-router-dom';
import { Leaf, Cpu, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        { name: 'Terminal', path: '/', icon: <Sparkles size={16} /> },
        { name: 'Batch Process', path: '/batch', icon: <Layers size={16} /> },
        { name: 'Telemetry', path: '/leaderboard', icon: <Cpu size={16} /> },
        { name: 'Protocol', path: '/about', icon: <ShieldAlert size={16} /> },
    ];

    return (
        <nav className="w-full z-50 bg-[#0a110e]/95 backdrop-blur-md border-b border-[#00ff88]/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between px-4 py-2">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00b8ff] p-[1px] group-hover:shadow-[0_0_10px_rgba(0,255,136,0.5)] transition-shadow shrink-0">
                        <div className="w-full h-full bg-[#0a110e] rounded-full flex items-center justify-center">
                            <Leaf size={14} className="text-[#00ff88]" />
                        </div>
                    </div>
                    <span className="text-sm font-bold tracking-wider text-white select-none shrink-0 truncate max-w-[120px] sm:max-w-none">
                        NEXUS<span className="text-gradient-brand">.carbon</span>
                    </span>
                </Link>

                <div className="flex items-center justify-end flex-grow gap-1 ml-2 overflow-x-auto no-scrollbar mask-fade-edges">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                title={item.name}
                                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 shrink-0
                  ${isActive
                                        ? 'bg-[rgba(0,255,136,0.15)] text-[#00ff88] shadow-[inset_0_0_10px_rgba(0,255,136,0.1)]'
                                        : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={isActive ? 'text-[#00ff88]' : 'text-[#94a3b8] group-hover:text-white'}>
                                    {item.icon}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
