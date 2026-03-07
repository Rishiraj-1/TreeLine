import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col justify-between pt-28 pb-8 px-4 sm:px-8">
            {/* Background ambient light effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00ff88] opacity-[0.03] blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00b8ff] opacity-[0.03] blur-[120px] pointer-events-none z-0"></div>

            <Navbar />
            <main className="w-full max-w-7xl mx-auto flex-grow relative z-10 mb-12">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
