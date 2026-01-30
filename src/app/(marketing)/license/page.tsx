import { InfoPage } from '@/components/layout/InfoPage';

export default function LicensePage() {
    return (
        <InfoPage
            title="Software License"
            subtitle="How our code and content can be used."
        >
            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">1. Proprietary Software</h2>
                    <p>
                        Decision Memory is proprietary software. All rights not explicitly granted are reserved by Decision Memory Inc. You may not decompile, reverse engineer, or attempt to derive the source code of the service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">2. User Content License</h2>
                    <p>
                        By posting decision logs, you grant Decision Memory a limited license to host, store, and process that data for the purpose of providing the service to you. You retain full ownership of your data.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-white">3. Third-Party Licenses</h2>
                    <p>
                        Decision Memory uses several open-source libraries. A full list of these libraries and their respective licenses is available upon request or in the "Legal" section of the mobile application (if applicable).
                    </p>
                </section>

                <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-500 font-bold">Last updated: January 28, 2026</p>
                </section>
            </div>
        </InfoPage>
    );
}
