import NoteReadingsClient from './NoteReadingsClient';

export const metadata = {
    title: 'Note Readings — Bhilai EE Labs',
    description: 'Create and record experimental observation tables, download as CSV/Excel, or save to your cloud workspace.',
};

export default function NoteReadingsPage() {
    return <NoteReadingsClient />;
}
