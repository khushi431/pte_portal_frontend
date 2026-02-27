"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ModuleSelector } from "../components/ModuleSelector";
import { QuestionTypeSelector } from "../components/QuestionTypeSelector";
import { QuestionForm } from "../components/QuestionForm";
import { MCQEditor } from "../editors/mcq/MCQEditor";
import { FillBlanksEditor } from "../editors/fillBlanks/FillBlanksEditor";
import { ReadingPassageEditor } from "../editors/reading/ReadingPassageEditor";
import { PteModule, QuestionTypeSlug } from "../types";

interface CreateQuestionPageProps {
    basePath: string; // "/admin/questionBank" or "/superAdmin/questionBank"
}

export function CreateQuestionPage({ basePath }: CreateQuestionPageProps) {
    const [selectedModule, setSelectedModule] = useState<PteModule | "all">("all");
    const [selectedType, setSelectedType] = useState<QuestionTypeSlug | null>(null);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Create Question"
                subtitle="Add a new question to the question bank"
                action={
                    <Link href={basePath}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="size-4" />
                            Back to Questions
                        </Button>
                    </Link>
                }
            />

            {/* Step 1: Select Module */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-700">
                    Step 1: Select Module
                </h2>
                <ModuleSelector
                    selectedModule={selectedModule}
                    onModuleChange={(mod) => {
                        setSelectedModule(mod);
                        setSelectedType(null);
                    }}
                />
            </div>

            {/* Step 2: Select Question Type */}
            {selectedModule !== "all" && (
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-700">
                        Step 2: Choose Question Type
                    </h2>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <QuestionTypeSelector
                            selectedModule={selectedModule}
                            selectedType={selectedType}
                            onTypeChange={setSelectedType}
                        />
                    </div>
                </div>
            )}

            {/* Step 3: Question Form / Editors */}
            {selectedType && (
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-700">
                        Step 3: Fill Question Details
                    </h2>

                    {/* Reading module → specialized editors */}
                    {selectedModule === "reading" &&
                        (selectedType === "mcq-single" ||
                            selectedType === "mcq-multiple") && (
                            <MCQEditor
                                module={selectedModule as PteModule}
                                questionType={selectedType}
                            />
                        )}

                    {selectedModule === "reading" &&
                        (selectedType === "fill-blanks-drag-drop" ||
                            selectedType === "fill-blanks-reading-writing") && (
                            <FillBlanksEditor
                                module={selectedModule as PteModule}
                                questionType={selectedType}
                            />
                        )}

                    {selectedModule === "reading" &&
                        selectedType === "reorder-paragraphs" && (
                            <ReadingPassageEditor
                                module={selectedModule as PteModule}
                                questionType={selectedType}
                            />
                        )}

                    {/* Other modules / types → generic form */}
                    {selectedModule !== "reading" && (
                        <QuestionForm
                            module={selectedModule as PteModule}
                            questionType={selectedType}
                            basePath={basePath}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
