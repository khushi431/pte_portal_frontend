"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

interface EditQuestionPageProps {
    questionId: string;
    basePath: string;
}

export function EditQuestionPage({ questionId, basePath }: EditQuestionPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Question"
                subtitle={`Editing question ${questionId}`}
                action={
                    <Link href={basePath}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="size-4" />
                            Back to Questions
                        </Button>
                    </Link>
                }
            />

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
                <p className="text-sm text-slate-500">
                    Edit form will be populated with question data.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    Question ID: {questionId}
                </p>
            </div>
        </div>
    );
}
