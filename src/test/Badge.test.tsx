import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '@/components/ui/Badge';
import '@testing-library/jest-dom';

describe('Badge Component', () => {
    it('renders correctly with default variant', () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText('Default Badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-primary');
    });

    it('renders with success variant', () => {
        render(<Badge variant="success">Success Badge</Badge>);
        const badge = screen.getByText('Success Badge');
        expect(badge).toHaveClass('bg-success/10');
    });

    it('renders with danger variant', () => {
        render(<Badge variant="danger">Danger Badge</Badge>);
        const badge = screen.getByText('Danger Badge');
        expect(badge).toHaveClass('bg-danger/10');
    });

    it('renders with secondary variant', () => {
        render(<Badge variant="secondary">Secondary Badge</Badge>);
        const badge = screen.getByText('Secondary Badge');
        expect(badge).toHaveClass('bg-gray-100');
    });
});
