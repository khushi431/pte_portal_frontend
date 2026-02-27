import { EditQuestionPage } from "@/modules/questionBank/pages/EditQuestionPage";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function SuperAdminEditQuestionPage({ params }: Props) {
    const { id } = await params;
    return <EditQuestionPage questionId={id} basePath="/superAdmin/questionBank" />;
}
