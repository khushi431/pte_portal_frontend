"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ModuleSelector } from "../components/ModuleSelector";
import { QuestionFilters } from "../components/QuestionFilters";
import { QuestionTable } from "../components/QuestionTable";
import { QuestionStats } from "../components/QuestionStats";
import { PreviewPanel } from "../components/PreviewPanel";
import { DUMMY_QUESTIONS } from "../data/dummyQuestions";
import { Difficulty, PteModule, Question } from "../types";

interface QuestionListPageProps {
    basePath: string; // "/admin/questionBank" or "/superAdmin/questionBank"
}

export function QuestionListPage({ basePath }: QuestionListPageProps) {
    const [selectedModule, setSelectedModule] = useState<PteModule | "all">("all");
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
    const [status, setStatus] = useState<"active" | "draft" | "archived" | "all">("all");
    const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

    // Module question counts
    const moduleCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        DUMMY_QUESTIONS.forEach((q) => {
            counts[q.module] = (counts[q.module] || 0) + 1;
        });
        return counts;
    }, []);

    // Filter questions
    const filteredQuestions = useMemo(() => {
        let result = [...DUMMY_QUESTIONS];

        if (selectedModule !== "all") {
            result = result.filter((q) => q.module === selectedModule);
        }

        if (difficulty !== "all") {
            result = result.filter((q) => q.difficulty === difficulty);
        }

        if (status !== "all") {
            result = result.filter((q) => q.status === status);
        }

        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(
                (q) =>
                    q.title.toLowerCase().includes(term) ||
                    q.content.toLowerCase().includes(term) ||
                    q.tags.some((t) => t.toLowerCase().includes(term))
            );
        }

        return result;
    }, [selectedModule, difficulty, status, search]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Question Bank"
                subtitle="Manage PTE Academic practice questions across all modules"
                action={
                    <Link href={`${basePath}/create`}>
                        <Button size="sm">
                            <Plus className="size-4" />
                            Add Question
                        </Button>
                    </Link>
                }
            />

            {/* Stats */}
            <QuestionStats />

            {/* Filters + Table in one card */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                {/* Header: module + filters + summary */}
                <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
                    {/* Module selector */}
                    <ModuleSelector
                        selectedModule={selectedModule}
                        onModuleChange={(mod) => {
                            setSelectedModule(mod);
                        }}
                        questionCounts={moduleCounts}
                    />

                    {/* Search & filters + result summary */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <QuestionFilters
                            search={search}
                            onSearchChange={setSearch}
                            difficulty={difficulty}
                            onDifficultyChange={setDifficulty}
                            status={status}
                            onStatusChange={setStatus}
                        />
                        <p className="text-xs md:text-sm text-slate-500 md:text-right">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredQuestions.length}
                            </span>{" "}
                            question{filteredQuestions.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Table body */}
                <div className=" px-3 pb-4 sm:px-4 sm:pb-5">
                    <QuestionTable
                        questions={filteredQuestions}
                        basePath={basePath}
                        onView={(q) => setPreviewQuestion(q)}
                        onEdit={(q) => {
                            // Navigate to edit - in real app use router
                            window.location.href = `${basePath}/${q.id}/edit`;
                        }}
                        onDelete={(q) => {
                            // In real app, show confirmation dialog
                            alert(`Delete question: ${q.title}?`);
                        }}
                    />
                </div>
            </div>

            {/* Preview Panel */}
            {previewQuestion && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={() => setPreviewQuestion(null)}
                    />
                    <PreviewPanel
                        question={previewQuestion}
                        onClose={() => setPreviewQuestion(null)}
                    />
                </>
            )}
        </div>
    );
}
