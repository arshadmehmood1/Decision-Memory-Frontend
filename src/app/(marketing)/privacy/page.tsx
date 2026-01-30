import { InfoPage } from '@/components/layout/InfoPage';

export default function PrivacyPage() {
    return (
        <InfoPage
            title="Privacy Policy"
            subtitle="Your decision data is yours. Here's how we protect it."
        >
            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">1. Data Collection</h2>
                    <p>
                        We collect information you provide directly when creating decision logs, including context, assumptions, and outcomes. We also collect basic account information like your email address.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">2. Data Usage</h2>
                    <p>
                        Your data is used solely to provide and improve the Decision Memory service. We do not sell your personal data or decision logs to third parties. AI analysis is performed on your data to provide you with insights, but this data is not used to train global models.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">3. Security</h2>
                    <p>
                        We use industry-standard encryption to protect your data both in transit and at rest. Your decision logs are only accessible to you and the team members you explicitly invite.
                    </p>
                </section>

                <section className="p-6 bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-500 font-bold">Last updated: January 28, 2026</p>
                </section>
            </div>
        </InfoPage>
    );
}
