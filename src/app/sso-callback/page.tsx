import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#050505]">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">
                    Syncing Neural ID...
                </p>
            </div>
            <AuthenticateWithRedirectCallback />
        </div>
    );
}
