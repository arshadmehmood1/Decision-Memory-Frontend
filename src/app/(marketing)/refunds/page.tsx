import { InfoPage } from '@/components/layout/InfoPage';

export default function RefundsPage() {
    return (
        <InfoPage
            title="Refund Policy"
            subtitle="Transparent and fair. How we handle payments and refunds."
        >
            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">1. 7-Day Free Trial</h2>
                    <p>
                        We offer a 7-day free trial for all our paid plans. No credit card is required to start the trial. You can cancel at any time during the trial period without being charged.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">2. Refund Eligibility</h2>
                    <p>
                        If you are unsatisfied with Decision Memory within the first 14 days of your paid subscription, we offer a full refund, no questions asked. After 14 days, refunds are handled on a case-by-case basis.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">3. How to Request</h2>
                    <p>
                        To request a refund, please email our support team at <strong>billing@decisionmemory.com</strong> with your account details and the reason for the request.
                    </p>
                </section>

                <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500 font-bold">Last updated: January 28, 2026</p>
                </section>
            </div>
        </InfoPage>
    );
}
