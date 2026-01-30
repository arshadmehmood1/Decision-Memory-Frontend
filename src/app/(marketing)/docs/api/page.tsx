import { InfoPage } from '@/components/layout/InfoPage';

export const dynamic = 'force-dynamic';

export default function ApiDocsPage() {
    return (
        <InfoPage
            title="API Reference"
            subtitle="Integrate Decision Memory into your applications with our REST API."
        >
            <div className="space-y-12">
                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Authentication</h2>
                    <p>
                        Authenticate your requests by including your API key in the <code>Authorization</code> header.
                    </p>
                    <pre className="p-6 bg-gray-950 text-blue-400 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed">
                        Authorization: Bearer YOUR_API_KEY
                    </pre>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Endpoints</h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-black rounded-full uppercase tracking-widest">GET</span>
                                <code className="text-white font-bold">/v1/decisions</code>
                            </div>
                            <p className="text-sm text-gray-500">List all decisions for the authenticated user.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-black rounded-full uppercase tracking-widest">POST</span>
                                <code className="text-white font-bold">/v1/decisions</code>
                            </div>
                            <p className="text-sm text-gray-500">Create a new decision log.</p>
                        </div>
                    </div>
                </section>

                <section className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                    <h2 className="text-2xl font-black text-gray-900">Beta Notice</h2>
                    <p>
                        The API is currently in public beta. Endpoints and schemas may change as we evolve. Join our <span className="text-primary font-bold cursor-pointer hover:underline">Discord</span> for updates.
                    </p>
                </section>
            </div>
        </InfoPage>
    );
}
