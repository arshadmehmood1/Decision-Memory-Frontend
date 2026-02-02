import { InfoPage } from '@/components/layout/InfoPage';

export default function FrameworksPage() {
    return (
        <InfoPage
            title="Strategic Frameworks"
            subtitle="Understand the DNA of high-velocity decision making."
        >
            <div className="space-y-12">
                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">RAPID Framework</h2>
                    <p>
                        Used by high-growth teams to clarify decision roles. RAPID stands for <strong>Recommend, Agree, Perform, Input, and Decide</strong>.
                        Decision Memory helps you assign these roles and track accountability across your workspace.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">DACI Model</h2>
                    <p>
                        The DACI framework (Driver, Approver, Contributor, Informed) ensures that everyone knows their specific
                        responsibility in the decision process, eliminating bottlenecks and ambiguity.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">The OODA Loop</h2>
                    <p>
                        Observe, Orient, Decide, Act. Our AI-driven insights are designed to accelerate your OODA loop by
                        providing predictive data based on your historical trace logs.
                    </p>
                </section>
            </div>
        </InfoPage>
    );
}
