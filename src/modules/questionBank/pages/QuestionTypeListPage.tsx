"use client";

import { PageHeader } from "@/components/page-header";
import { QuestionTypeTable } from "../components/QuestionTypeTable";
import { QUESTION_TYPES } from "../constants/questionTypes";

export function QuestionTypeListPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Question Types"
                subtitle="Manage all PTE question types used across modules"
            />
            <QuestionTypeTable initialTypes={QUESTION_TYPES} />
        </div>
    );
}

