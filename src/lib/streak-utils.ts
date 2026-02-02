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
 * Calculates daily streak and last 7 days activity.
 */
export function calculateStreak(decisions: Decision[]): { currentStreak: number; longestStreak: number; activity: boolean[] } {
    if (!decisions || decisions.length === 0) {
        return { currentStreak: 0, longestStreak: 0, activity: Array(7).fill(false) };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a set of dates where decisions were made for O(1) lookup
    const decisionsByDate = new Set(
        decisions.map(d => {
            const date = new Date(d.madeOn);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        })
    );

    // 1. Calculate Activity for last 7 days (including today)
    // We want [6 days ago, ..., today]
    const activity: boolean[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        activity.push(decisionsByDate.has(d.getTime()));
    }

    // 2. Calculate Current Daily Streak
    let currentStreak = 0;
    // Check backwards from today
    // If today has no decision, check if yesterday does to allow for "active streak but haven't logged today yet"
    // But strict streak usually implies consecutive days.
    // Let's implement: Streak is unbroken if today OR yesterday has a decision.
    // If neither, streak is 0.

    // We iterate backwards from today
    let checkDate = new Date(today);
    while (true) {
        if (decisionsByDate.has(checkDate.getTime())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // If today is missing, allow it if yesterday was active (grace period of current day)
            // But if we are already checking prior days and miss one, streak is over.
            if (checkDate.getTime() === today.getTime()) {
                checkDate.setDate(checkDate.getDate() - 1);
                continue; // Try yesterday
            }
            break;
        }
    }

    // 3. Calculate Longest Streak (Naive implementation for now, just max of current vs store)
    // Since we don't track historical longest perfectly without scanning all history,
    // we will scan the sorted dates.
    let max = 0;
    let temp = 0;
    const sortedDates = [...decisionsByDate].sort((a, b) => a - b);

    // Iterate through sorted unique dates
    for (let i = 0; i < sortedDates.length; i++) {
        const currentParams = sortedDates[i];
        if (i > 0) {
            const prev = sortedDates[i - 1];
            const diffDays = (currentParams - prev) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                temp++;
            } else {
                temp = 1;
            }
        } else {
            temp = 1;
        }
        max = Math.max(max, temp);
    }

    return {
        currentStreak,
        longestStreak: max,
        activity
    };
}
