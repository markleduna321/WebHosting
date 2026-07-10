import MainLayout from '@/Layouts/MainLayout';
import ClassroomManagementSection from './_sections/ClassroomManagementSection';

export default function ClassroomsPage() {
    return <ClassroomManagementSection />;
}

ClassroomsPage.layout = (page) => <MainLayout>{page}</MainLayout>;