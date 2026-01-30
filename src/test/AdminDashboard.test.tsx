import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../app/(admin)/admin/page';
import AdminBroadcast from '../app/(admin)/admin/broadcast/page';
import AdminCMS from '../app/(admin)/admin/cms/page';
import { useStore } from '../lib/store';
import { apiRequest } from '../lib/api-client';

// Mock store and API
vi.mock('../lib/store', () => ({
    useStore: vi.fn()
}));

vi.mock('../lib/api-client', () => ({
    apiRequest: vi.fn().mockResolvedValue({ data: {} })
}));

describe('Admin Dashboard UI Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useStore as any).mockReturnValue({
            currentUser: { role: 'ADMIN' },
        });
    });

    describe('AdminOverview', () => {
        it('renders KPI cards with correct values', async () => {
            (apiRequest as any).mockResolvedValue({
                data: {
                    userCount: 150,
                    paidUserCount: 45,
                    avgEngagementTime: 120,
                    recentActivity: []
                }
            });

            render(<AdminDashboard />);

            expect(await screen.findByText('150')).toBeDefined();
            expect(screen.getByText('Total Neural Nodes')).toBeDefined();
            expect(screen.getByText('45')).toBeDefined();
        });
    });

    describe('AdminBroadcast', () => {
        it('handles broadcast preview toggle', async () => {
            render(<AdminBroadcast />);

            const previewBtn = screen.getByText(/Show Preview/i);
            fireEvent.click(previewBtn);

            expect(screen.getByText('End-User Perception')).toBeDefined();
        });

        it('disables send button when title is missing', () => {
            render(<AdminBroadcast />);
            const sendBtn = screen.getByText('Broadcast').closest('button');
            expect(sendBtn).toBeDisabled();
        });
    });

    describe('AdminCMS', () => {
        it('opens the content architect editor', async () => {
            render(<AdminCMS />);
            const newVerBtn = screen.getByText(/New Version/i);
            fireEvent.click(newVerBtn);

            expect(screen.getByText('Content Architect')).toBeDefined();
            expect(screen.getByText(/Editing Segment: LANDING/i)).toBeDefined();
        });

        it('adds a new section in the editor', async () => {
            render(<AdminCMS />);
            fireEvent.click(screen.getByText(/New Version/i));

            const addBtn = screen.getByText(/Fuse New Neural Section/i);
            fireEvent.click(addBtn);

            const sections = screen.getAllByText(/Section \d+/);
            expect(sections.length).toBeGreaterThan(1);
        });
    });
});
