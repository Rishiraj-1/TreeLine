import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="flex flex-col w-[450px] h-[600px] bg-[#050a08] text-white overflow-hidden relative">
            {/* Background ambient light effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00ff88] opacity-10 blur-[60px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00b8ff] opacity-10 blur-[60px] pointer-events-none z-0"></div>

            <Navbar />
            <main className="w-full h-full mx-auto flex-grow relative z-10 p-3 overflow-y-auto overflow-x-hidden pb-12 rounded-b-xl border-t border-white/5 shadow-[inset_0_20px_20px_-20px_rgba(0,0,0,0.5)]">
                <Outlet />
            </main>
        </div>
    );
}
