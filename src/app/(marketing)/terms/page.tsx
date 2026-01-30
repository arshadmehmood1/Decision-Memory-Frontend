import { InfoPage } from '@/components/layout/InfoPage';

export default function TermsPage() {
    return (
        <InfoPage
            title="Terms of Service"
            subtitle="The ground rules for using Decision Memory."
        >
            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">1. Acceptance of Terms</h2>
                    <p>
                        By creating an account or using Decision Memory, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">2. Account Responsibility</h2>
                    <p>
                        You are responsible for maintaining the security of your account and any decision logs created under it. You must notify us immediately of any unauthorized use of your account.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">3. Prohibited Conduct</h2>
                    <p>
                        You agree not to use Decision Memory for any illegal purpose or to upload any content that violates the rights of third parties or is harmful, deceptive, or offensive.
                    </p>
                </section>

                <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500 font-bold">Last updated: January 28, 2026</p>
                </section>
            </div>
        </InfoPage>
    );
}
