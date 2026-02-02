import { Decision } from './store';

export interface CategoryStat {
    category: string;
    total: number;
    succeeded: number;
    failed: number;
    rate: number;
}

export interface AnalyticsSummary {
    totalDecisions: number;
    successRate: number;
    velocity: number; // Decisions in last 30 days
    categoryBreakdown: CategoryStat[];
}

export function calculateAnalytics(decisions: Decision[]): AnalyticsSummary {
    const totalDecisions = decisions.length;
    const reviewedDecisions = decisions.filter(d => ['SUCCEEDED', 'FAILED', 'REVERSED'].includes(d.status));
    const succeeded = decisions.filter(d => d.status === 'SUCCEEDED').length;

    const successRate = reviewedDecisions.length > 0
        ? Math.round((succeeded / reviewedDecisions.length) * 100)
        : 0;

    // Velocity (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const velocity = decisions.filter(d => new Date(d.madeOn) > thirtyDaysAgo).length;

    // Category Breakdown
    const categories = Array.from(new Set(decisions.map(d => d.category)));
    const categoryBreakdown: CategoryStat[] = categories.map(cat => {
        const catDecisions = decisions.filter(d => d.category === cat);
        const catReviewed = catDecisions.filter(d => ['SUCCEEDED', 'FAILED'].includes(d.status));
        const catSucceeded = catDecisions.filter(d => d.status === 'SUCCEEDED').length;
        const catFailed = catDecisions.filter(d => d.status === 'FAILED').length;

        return {
            category: cat,
            total: catDecisions.length,
            succeeded: catSucceeded,
            failed: catFailed,
            rate: catReviewed.length > 0 ? Math.round((catSucceeded / catReviewed.length) * 100) : 0
        };
    }).sort((a, b) => b.total - a.total);

    return {
        totalDecisions,
        successRate,
        velocity,
        categoryBreakdown
    };
}
