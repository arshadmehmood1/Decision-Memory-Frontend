import { describe, it, expect } from 'vitest';
import { formatDate, cn } from '@/lib/utils';

describe('Utility Functions', () => {
    describe('formatDate', () => {
        it('should format valid date strings correctly', () => {
            // Intl.DateTimeFormat with month: 'short' produces 'Jan' for '01'
            expect(formatDate('2026-01-15')).toContain('Jan 15, 2026');
        });

        it('should handle different date formats', () => {
            expect(formatDate('2025-12-25T10:00:00Z')).toContain('Dec 25, 2025');
        });
    });

    describe('cn', () => {
        it('should merge tailwind classes correctly', () => {
            expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
            // Note: tailwind-merge might not always collapse these if they are separate properties,
            // but in this case, it usually does for the same property.
            const result = cn('px-2', 'px-4');
            expect(result).toContain('px-4');
            expect(result).not.toContain('px-2');
        });
    });
});
