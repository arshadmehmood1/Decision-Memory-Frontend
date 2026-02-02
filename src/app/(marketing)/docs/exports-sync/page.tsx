import { InfoPage } from '@/components/layout/InfoPage';

export default function ExportsSyncPage() {
    return (
        <InfoPage
            title="Data Portability"
            subtitle="Your strategic data, wherever you need it."
        >
            <div className="space-y-12">
                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">PDF & High-Fidelity Exports</h2>
                    <p>
                        Export your decision traces into beautifully formatted PDF documents for board meetings,
                        regulatory compliance, or team retrospectives.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Notion Synchronization</h2>
                    <p>
                        Bridge the gap between your workspace and your knowledge base. Decisions can be automatically
                        synced to a Notion database for company-wide visibility.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">GitHub Integration</h2>
                    <p>
                        Link your technical decisions directly to repository PRs. The Decision Memory bot will
                        cross-reference trace IDs in your commits to provide historical context for code changes.
                    </p>
                </section>
            </div>
        </InfoPage>
    );
}
