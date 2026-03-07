"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ModuleSelector } from "../components/ModuleSelector";
import { QuestionTypeSelector } from "../components/QuestionTypeSelector";
import { QuestionForm } from "../components/QuestionForm";
import { MCQEditor } from "../editors/mcq/MCQEditor";
import { FillBlanksEditor } from "../editors/fillBlanks/FillBlanksEditor";
import { ReadingPassageEditor } from "../editors/reading/ReadingPassageEditor";
import { WritingEditor } from "../editors/writing/WritingEditor";
import { ListeningEditor, ListeningEditorProps } from "../editors/listening/ListeningAudioEditor";
import { SpeakingEditor, SpeakingEditorProps } from "../editors/speaking/SpeakingPromptEditor";
import { PteModule, QuestionTypeSlug } from "../types";
import { cn } from "@/lib/utils";

interface CreateQuestionPageProps {
    basePath: string; // "/admin/questionBank" or "/superAdmin/questionBank"
}

export function CreateQuestionPage({ basePath }: CreateQuestionPageProps) {
    const [selectedModule, setSelectedModule] = useState<PteModule | "all">("all");
    const [selectedType, setSelectedType] = useState<QuestionTypeSlug | null>(null);

    const currentStep =
        selectedModule === "all" ? 1 : !selectedType ? 2 : 3;

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

            {/* Top stepper */}
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center">
                        {[
                            {
                                id: 1,
                                label: "Select module",
                                description: "Choose the PTE module to create a question for.",
                            },
                            {
                                id: 2,
                                label: "Choose type",
                                description: "Pick the question template",
                            },
                            {
                                id: 3,
                                label: "Write question",
                                description: "Add passage, answers & difficulty",
                            },
                        ].map((step, index, arr) => {
                            const status =
                                currentStep > step.id
                                    ? "done"
                                    : currentStep === step.id
                                        ? "current"
                                        : "upcoming";

                            return (
                                <Fragment key={step.id}>
                                    {/* Step node */}
                                    <div className="flex shrink-0 items-center gap-2">
                                        <div
                                            className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                                                status === "done" &&
                                                    "bg-primary text-primary-foreground shadow-sm",
                                                status === "current" &&
                                                    "bg-primary/10 text-primary border border-primary/40",
                                                status === "upcoming" &&
                                                    "bg-slate-100 text-slate-500"
                                            )}
                                        >
                                            {status === "done" ? (
                                                <Check className="size-3.5" />
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p
                                                className={cn(
                                                    "text-xs font-semibold",
                                                    status === "upcoming"
                                                        ? "text-slate-500"
                                                        : "text-slate-900"
                                                )}
                                            >
                                                {step.label}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Tail connector — equal flex-1 between every step pair */}
                                    {index < arr.length - 1 && (
                                        <div className="hidden flex-1 items-center px-3 sm:flex">
                                            <div
                                                className={cn(
                                                    "h-[2px] w-full rounded-full",
                                                    currentStep > step.id
                                                        ? "bg-primary"
                                                        : "bg-slate-200"
                                                )}
                                            />
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                    <div className="text-[11px] text-slate-400 whitespace-nowrap sm:ml-4">
                        Step {currentStep} of 3
                    </div>
                </div>
            </div>

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
                    showAll={false}
                />
                {selectedModule === "all" && (
                    <div className="mt-6 flex items-center justify-center">
                        <div className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/90 px-8 py-12 text-center text-xs sm:text-sm text-slate-600">
                            <p className="mb-3 text-sm font-semibold text-slate-700 sm:text-base">
                                Select a module to start creating a question
                            </p>
                            <p className="mx-auto max-w-2xl text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                                Choose <span className="font-semibold">Reading</span>,{" "}
                                <span className="font-semibold">Speaking</span>,{" "}
                                <span className="font-semibold">Writing</span> or{" "}
                                <span className="font-semibold">Listening</span> above. We’ll then
                                show you the relevant question types and editor for that module.
                            </p>
                        </div>
                    </div>
                )}
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
                                key={selectedType}
                                module={selectedModule as PteModule}
                                questionType={selectedType}
                            />
                        )}

                    {selectedModule === "reading" &&
                        (selectedType === "fill-blanks-drag-drop" ||
                            selectedType === "fill-blanks-reading-writing") && (
                            <FillBlanksEditor
                                key={selectedType}
                                module={selectedModule as PteModule}
                                questionType={selectedType}
                            />
                        )}

                    {selectedModule === "reading" &&
                        selectedType === "reorder-paragraphs" && (
                            <ReadingPassageEditor
                                key={selectedType}
                                module={selectedModule as PteModule}
                                questionType={selectedType}
                            />
                        )}

                    {/* Writing module → specialized editor */}
                    {selectedModule === "writing" &&
                        (selectedType === "summarize-written-text" ||
                            selectedType === "write-essay") && (
                            <WritingEditor
                                key={selectedType}
                                module={selectedModule as PteModule}
                                questionType={selectedType}
                            />
                        )}

                    {/* Listening module → specialized editor */}
                    {selectedModule === "listening" && (
                        <ListeningEditor
                            key={selectedType}
                            module={selectedModule as PteModule}
                            questionType={selectedType as ListeningEditorProps["questionType"]}
                        />
                    )}

                    {/* Speaking module → specialized editor */}
                    {selectedModule === "speaking" && (
                        <SpeakingEditor
                            key={selectedType}
                            module={selectedModule as PteModule}
                            questionType={selectedType as SpeakingEditorProps["questionType"]}
                        />
                    )}

                    {/* Other modules / types → generic form */}
                    {selectedModule !== "reading" &&
                        selectedModule !== "writing" &&
                        selectedModule !== "listening" &&
                        selectedModule !== "speaking" && (
                        <QuestionForm
                            key={`${selectedModule}-${selectedType}`}
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
