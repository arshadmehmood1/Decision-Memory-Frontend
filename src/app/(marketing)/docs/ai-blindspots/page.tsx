import { InfoPage } from '@/components/layout/InfoPage';

export default function AIBlindspotsPage() {
    return (
        <InfoPage
            title="AI Neural Guardrails"
            subtitle="How we identify cognitive biases before they impact your outcome."
        >
            <div className="space-y-12">
                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Cognitive Bias Detection</h2>
                    <p>
                        Our neural engine analyzes your decision context, assumptions, and alternatives to detect common
                        patterns of failure, such as:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Confirmation Bias:</strong> Only seeking info that supports the decision.</li>
                        <li><strong>Sunk Cost Fallacy:</strong> Continuing a path because of past investment.</li>
                        <li><strong>Dunning-Kruger Effect:</strong> Overestimating confidence in low-knowledge areas.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Real-time Quality Analysis</h2>
                    <p>
                        As you type, the <strong>Quality Meter</strong> provides real-time feedback on the robustness of your
                        documentation. Higher quality logs lead to more accurate AI insights.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Pattern Recognition</h2>
                    <p>
                        The system cross-references your current decision with thousands of anonymized data points to
                        alert you when you're following a path that has historically led to a "REVERSED" status.
                    </p>
                </section>
            </div>
        </InfoPage>
    );
}
