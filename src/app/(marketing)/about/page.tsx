import { InfoPage } from '@/components/layout/InfoPage';

export default function AboutPage() {
    return (
        <InfoPage
            title="About Decision Memory"
            subtitle="We're on a mission to build the world's most intelligent decision-tracking platform."
        >
            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Our Vision</h2>
                    <p>
                        Decision Memory was born out of a simple observation: founders and teams make hundreds of high-stakes decisions every year, but very few of them are documented, analyzed, or learned from. We're building the "GitHub for Decisions" to help you track the context, assumptions, and outcomes of your choices.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Why It Matters</h2>
                    <p>
                        Without a record of your decisions, you're prone to hindsight bias—believing you "knew it all along" when things go well, or blaming bad luck when they don't. By logging your decisions, you build a "mistake repository" that prevents you from repeating expensive errors.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">The Team</h2>
                    <p>
                        We are a small, dedicated team of engineers and designers obsessed with cognitive psychology and decision science. Based in the cloud, serving founders worldwide.
                    </p>
                </section>
            </div>
        </InfoPage>
    );
}
