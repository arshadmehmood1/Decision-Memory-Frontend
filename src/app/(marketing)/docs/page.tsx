import { InfoPage } from '@/components/layout/InfoPage';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DocsPage() {
    return (
        <InfoPage
            title="Documentation"
            subtitle="Learn how to master your decision intelligence with Decision Memory."
        >
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: "Getting Started", desc: "Create your first decision log in under 60 seconds." },
                        { title: "Decision Frameworks", desc: "Learn about RAPID, DACI, and other frameworks we support." },
                        { title: "AI Blindspots", desc: "Understanding how our AI identifies your cognitive biases." },
                        { title: "Exports & Sync", desc: "Sync your decisions with Notion, GitHub, or export to PDF." }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary/20 transition-colors">
                            <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-500 mb-4">{item.desc}</p>
                            <Link href="#" className="text-primary font-bold hover:underline">Read more →</Link>
                        </div>
                    ))}
                </div>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-gray-900">Developer Tools</h2>
                    <p>
                        Looking to integrate Decision Memory into your own workflow? Check out our <Link href="/docs/api" className="text-primary hover:underline">API Documentation</Link>.
                    </p>
                </section>
            </div>
        </InfoPage>
    );
}
