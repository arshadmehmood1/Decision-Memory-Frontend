import { Decision } from "./store";

export interface PatternMatch {
    decisionId: string;
    title: string;
    reason: string;
    score: number;
}

const COMMON_STOPWORDS = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'migration', 'update', 'new']);

export function detectFailurePatterns(
    currentTitle: string,
    currentContext: string,
    pastDecisions: Decision[]
): PatternMatch | null {
    if (!currentTitle || currentTitle.length < 5) return null;

    const failedDecisions = pastDecisions.filter(d => d.status === 'FAILED' || d.status === 'REVERSED');
    if (failedDecisions.length === 0) return null;

    const currentWords = new Set(
        `${currentTitle} ${currentContext}`
            .toLowerCase()
            .split(/\W+/)
            .filter(w => w.length > 3 && !COMMON_STOPWORDS.has(w))
    );

    let bestMatch: PatternMatch | null = null;
    let maxOverlap = 0;

    for (const failed of failedDecisions) {
        const failedWords = new Set(
            `${failed.title} ${failed.context}`
                .toLowerCase()
                .split(/\W+/)
                .filter(w => w.length > 3 && !COMMON_STOPWORDS.has(w))
        );

        let overlapCount = 0;
        failedWords.forEach(word => {
            if (currentWords.has(word)) overlapCount++;
        });

        if (overlapCount > maxOverlap && overlapCount >= 2) {
            maxOverlap = overlapCount;
            bestMatch = {
                decisionId: failed.id,
                title: failed.title,
                reason: `Matches ${overlapCount} keywords from a previous failed attempt.`,
                score: overlapCount
            };
        }
    }

    return bestMatch;
}
