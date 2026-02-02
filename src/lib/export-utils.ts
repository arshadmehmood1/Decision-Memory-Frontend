import { Decision } from "./store";

export function downloadJson(data: object, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function downloadCsv(decisions: Decision[], filename: string) {
    if (decisions.length === 0) return;

    // Define columns
    const headers = ['ID', 'Title', 'Date', 'Status', 'Verdict', 'Context', 'Author', 'Category', 'Risk Score'];

    // Map data to rows
    const rows = decisions.map(d => [
        d.id,
        `"${d.title.replace(/"/g, '""')}"`, // Escape quotes
        d.madeOn,
        d.status,
        `"${d.decision.replace(/"/g, '""')}"`,
        `"${d.context.replace(/"/g, '""')}"`,
        d.madeBy,
        d.category,
        d.aiRiskScore || 0
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
