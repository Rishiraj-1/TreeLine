export default function Footer() {
    return (
        <footer className="text-center py-6 text-[#5a7e6e] text-sm mt-auto border-t border-green-accent/10 w-full max-w-7xl mx-auto">
            <p className="flex items-center justify-center gap-2">
                <span>🌿</span> PromptPrint &middot; Carbon estimates are approximations based on publicly available data
            </p>
            <p className="mt-2 text-xs text-[#3d5a4e]">
                Energy data: estimated Wh/token &middot; Grid: US avg 386 gCO₂/kWh
            </p>
        </footer>
    );
}
