"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ModuleSelector } from "../components/ModuleSelector";
import { QuestionTypeSelector } from "../components/QuestionTypeSelector";
import { QuestionFilters } from "../components/QuestionFilters";
import { QuestionTable } from "../components/QuestionTable";
import { QuestionStats } from "../components/QuestionStats";
import { PreviewPanel } from "../components/PreviewPanel";
import { DUMMY_QUESTIONS } from "../data/dummyQuestions";
import { Difficulty, PteModule, Question, QuestionTypeSlug } from "../types";

interface QuestionListPageProps {
    basePath: string; // "/admin/questionBank" or "/superAdmin/questionBank"
}

export function QuestionListPage({ basePath }: QuestionListPageProps) {
    const [selectedModule, setSelectedModule] = useState<PteModule | "all">("all");
    const [selectedType, setSelectedType] = useState<QuestionTypeSlug | null>(null);
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
    const [status, setStatus] = useState<"active" | "draft" | "archived" | "all">("all");
    const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
    const [showTypeSelector, setShowTypeSelector] = useState(false);

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

        if (selectedType) {
            result = result.filter((q) => q.questionType === selectedType);
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
    }, [selectedModule, selectedType, difficulty, status, search]);

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

            {/* Module Selector */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <ModuleSelector
                        selectedModule={selectedModule}
                        onModuleChange={(mod) => {
                            setSelectedModule(mod);
                            setSelectedType(null);
                        }}
                        questionCounts={moduleCounts}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTypeSelector(!showTypeSelector)}
                        className="hidden sm:flex"
                    >
                        {showTypeSelector ? "Hide" : "Show"} Question Types
                    </Button>
                </div>

                {/* Question Types Grid */}
                {showTypeSelector && (
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <QuestionTypeSelector
                            selectedModule={selectedModule}
                            selectedType={selectedType}
                            onTypeChange={setSelectedType}
                        />
                    </div>
                )}
            </div>

            {/* Filters */}
            <QuestionFilters
                search={search}
                onSearchChange={setSearch}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                status={status}
                onStatusChange={setStatus}
            />

            {/* Results info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-700">{filteredQuestions.length}</span>{" "}
                    question{filteredQuestions.length !== 1 ? "s" : ""}
                    {selectedType && (
                        <button
                            onClick={() => setSelectedType(null)}
                            className="ml-2 text-xs text-primary hover:underline"
                        >
                            Clear type filter ×
                        </button>
                    )}
                </p>
            </div>

            {/* Question Table */}
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
