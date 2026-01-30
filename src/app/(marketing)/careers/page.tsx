import { InfoPage } from '@/components/layout/InfoPage';
import { Button } from '@/components/ui/Button';

export default function CareersPage() {
    return (
        <InfoPage
            title="Join the Memory"
            subtitle="Help us build the cognitive infrastructure for the next generation of founders."
        >
            <div className="space-y-12">
                <section className="space-y-4">
                    <h2 className="text-3xl font-black text-white">Why Join Us?</h2>
                    <p>
                        At Decision Memory, we're not just building a CRUD app. We're building tools that change how people think. We're a remote-first, async-heavy team that values deep work, intellectual honesty, and high-velocity shipping.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-black text-white">Open Roles</h2>
                    <div className="space-y-4">
                        {[
                            { role: "Senior Frontend Engineer", type: "Remote • Full-time", dept: "Engineering" },
                            { role: "AI Research Engineer", type: "Remote • Full-time", dept: "Engineering" },
                            { role: "Product Designer", type: "Remote • Full-time", dept: "Design" }
                        ].map((job, idx) => (
                            <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/30 transition-colors">
                                <div>
                                    <div className="text-xs font-black uppercase text-primary tracking-widest mb-1">{job.dept}</div>
                                    <h3 className="text-xl font-black text-white">{job.role}</h3>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{job.type}</div>
                                </div>
                                <Button variant="outline" className="rounded-xl">Apply Now</Button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="p-8 bg-blue-500/10 rounded-3xl border border-blue-500/20 space-y-4">
                    <h2 className="text-2xl font-black text-blue-400">Don't see a fit?</h2>
                    <p className="text-blue-100">
                        We're always looking for exceptional talent. If you're passionate about decision science and engineering, send us a note at <strong>jobs@decisionmemory.com</strong>.
                    </p>
                </section>
            </div>
        </InfoPage>
    );
}
