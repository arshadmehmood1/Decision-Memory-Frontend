import { Decision } from './store';
import {
    startOfWeek,
    subWeeks,
    isSameWeek,
    parseISO,
    isAfter,
    differenceInWeeks
} from 'date-fns';

/**
 * Calculates the current streak of consecutive weeks with at least one decision.
 * A week is considered active if at least one decision was made during that week.
 * The streak breaks if a week is skipped.
 */
export function calculateStreak(decisions: Decision[]): number {
    if (!decisions || decisions.length === 0) return 0;

    // 1. Get all unique weeks that have decisions, sorted descending
    const decisionWeeks = decisions
        .map(d => startOfWeek(parseISO(d.madeOn), { weekStartsOn: 1 })) // Monday start
        .sort((a, b) => b.getTime() - a.getTime());

    // Remove duplicates (multiple decisions in same week)
    const uniqueWeeks: Date[] = [];
    decisionWeeks.forEach(w => {
        if (!uniqueWeeks.some(uw => isSameWeek(uw, w, { weekStartsOn: 1 }))) {
            uniqueWeeks.push(w);
        }
    });

    if (uniqueWeeks.length === 0) return 0;

    const today = new Date();
    const currentWeek = startOfWeek(today, { weekStartsOn: 1 });

    // 2. Check if the most recent decision was this week or last week
    // If the last decision was older than last week, the streak is broken
    const latestDecisionWeek = uniqueWeeks[0];
    const weeksDiff = differenceInWeeks(currentWeek, latestDecisionWeek);

    if (weeksDiff > 1) {
        return 0; // Streak broken: more than 1 week gap from current week
    }

    // 3. Count consecutive weeks backwards
    let streak = 0;
    let expectedWeek = latestDecisionWeek;

    for (const week of uniqueWeeks) {
        if (isSameWeek(week, expectedWeek, { weekStartsOn: 1 })) {
            streak++;
            expectedWeek = subWeeks(expectedWeek, 1);
        } else {
            break; // Gap found
        }
    }

    return streak;
}
