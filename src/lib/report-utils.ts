import { Decision } from './store';
import {
    parseISO,
    isSameMonth,
    isSameYear,
    getMonth,
    getYear
} from 'date-fns';

export interface MonthlyReportData {
    monthName: string;
    year: number;
    totalDecisions: number;
    categoryBreakdown: Record<string, number>;
    averageRiskScore: number;
    statusDistribution: Record<string, number>;
    topCategory: string;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Generates an analytical report for a specific month and year.
 */
export function generateMonthlyReport(
    decisions: Decision[],
    month: number, // 0-indexed
    year: number
): MonthlyReportData {
    const monthDecisions = decisions.filter(d => {
        const date = parseISO(d.madeOn);
        return getMonth(date) === month && getYear(date) === year;
    });

    const totalDecisions = monthDecisions.length;
    const categoryBreakdown: Record<string, number> = {};
    const statusDistribution: Record<string, number> = {};
    let totalRiskScore = 0;
    let riskScoredCount = 0;

    monthDecisions.forEach(d => {
        // Category
        categoryBreakdown[d.category] = (categoryBreakdown[d.category] || 0) + 1;

        // Status
        statusDistribution[d.status] = (statusDistribution[d.status] || 0) + 1;

        // Risk Score
        if (d.aiRiskScore !== undefined) {
            totalRiskScore += d.aiRiskScore;
            riskScoredCount++;
        }
    });

    // Find top category
    let topCategory = 'None';
    let maxCount = 0;
    Object.entries(categoryBreakdown).forEach(([cat, count]) => {
        if (count > maxCount) {
            maxCount = count;
            topCategory = cat;
        }
    });

    return {
        monthName: MONTH_NAMES[month],
        year,
        totalDecisions,
        categoryBreakdown,
        averageRiskScore: riskScoredCount > 0 ? Math.round(totalRiskScore / riskScoredCount) : 0,
        statusDistribution,
        topCategory
    };
}
