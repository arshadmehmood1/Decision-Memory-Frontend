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
                        { title: "Getting Started", desc: "Create your first decision log in under 60 seconds.", href: "/docs/getting-started" },
                        { title: "Decision Frameworks", desc: "Learn about RAPID, DACI, and other frameworks we support.", href: "/docs/frameworks" },
                        { title: "AI Blindspots", desc: "Understanding how our AI identifies your cognitive biases.", href: "/docs/ai-blindspots" },
                        { title: "Exports & Sync", desc: "Sync your decisions with Notion, GitHub, or export to PDF.", href: "/docs/exports-sync" }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary/20 transition-colors">
                            <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-500 mb-4">{item.desc}</p>
                            <Link href={item.href} className="text-primary font-bold hover:underline">Read more →</Link>
                        </div>
                    ))}
                </div>

            </div>
        </InfoPage>
    );
}
