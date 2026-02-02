import UpdatesManagementClient from './UpdatesManagementClient';

export const metadata = {
    title: 'Updates Manager | Admin',
    description: 'Manage app updates and announcements'
};

export default function UpdatesPage() {
    return <UpdatesManagementClient />;
}
