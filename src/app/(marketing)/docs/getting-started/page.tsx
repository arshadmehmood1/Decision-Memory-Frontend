import { InfoPage } from '@/components/layout/InfoPage';

export default function GettingStartedPage() {
    return (
        <InfoPage
            title="Getting Started"
            subtitle="Master the art of decision logging in under 60 seconds."
        >
            <div className="space-y-12">
                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">1. Create Your First Trace</h2>
                    <p>
                        Navigate to the <strong>New Decision</strong> page from your dashboard. Our AI-driven interface is designed to
                        capture the nuance of your choice without the friction of traditional documentation.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Title:</strong> Be specific. "Migration to Postgres" is better than "Database Change".</li>
                        <li><strong>Category:</strong> Helps the neural engine categorize your strategic vectors.</li>
                        <li><strong>The Decision:</strong> State exactly what path was chosen.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">2. Document the Context</h2>
                    <p>
                        Context is the critical layer. Why now? What constraints were present? This information is what
                        allows future-you to learn from current-you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">3. Setting Guardrails</h2>
                    <p>
                        Add <strong>Alternatives</strong> and <strong>Assumptions</strong>. These are the markers our AI uses to
                        detect cognitive biases and provide real-time alerts.
                    </p>
                </section>

                <div className="p-8 bg-primary/10 border border-primary/20 rounded-3xl">
                    <p className="text-primary font-bold italic">
                        "A decision without documented context is just a guess stored in a database."
                    </p>
                </div>
            </div>
        </InfoPage>
    );
}
