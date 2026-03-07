"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Search, Filter, Clock, FileQuestion, Award, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppInput } from "@/components/ui/app-input";
import { AppSelect } from "@/components/ui/app-select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { DraggableModal } from "@/components/ui/draggable-modal";
import { cn } from "@/lib/utils";
import { DUMMY_QUESTIONS } from "@/modules/questionBank/data/dummyQuestions";
import { Question, PteModule, Difficulty } from "@/modules/questionBank/types";
import { TestStatus } from "../types";
import { PTE_MODULES } from "@/modules/questionBank/constants/modules";

interface CreateTestPageProps {
    basePath: string;
}

interface SelectedQuestion {
    questionId: string;
    question: Question;
    points: number;
    order: number;
}

export function CreateTestPage({ basePath }: CreateTestPageProps) {
    const router = useRouter();

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState<number>(60);
    const [status, setStatus] = useState<TestStatus>("draft");
    const [isPublic, setIsPublic] = useState(true);
    const [passingScore, setPassingScore] = useState<number | undefined>(65);
    const [instructions, setInstructions] = useState("");
    const [tags, setTags] = useState("");
    const [scheduledStart, setScheduledStart] = useState("");
    const [scheduledEnd, setScheduledEnd] = useState("");

    // Question selection state
    const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [moduleFilter, setModuleFilter] = useState<PteModule | "all">("all");
    const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");
    const [showQuestionSelector, setShowQuestionSelector] = useState(false);

    // Filter available questions
    const availableQuestions = useMemo(() => {
        let filtered = [...DUMMY_QUESTIONS].filter((q) => q.status === "active");

        // Exclude already selected questions
        const selectedIds = new Set(selectedQuestions.map((sq) => sq.questionId));
        filtered = filtered.filter((q) => !selectedIds.has(q.id));

        if (moduleFilter !== "all") {
            filtered = filtered.filter((q) => q.module === moduleFilter);
        }

        if (difficultyFilter !== "all") {
            filtered = filtered.filter((q) => q.difficulty === difficultyFilter);
        }

        if (searchQuery.trim()) {
            const term = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (q) =>
                    q.title.toLowerCase().includes(term) ||
                    q.content.toLowerCase().includes(term) ||
                    q.tags.some((t) => t.toLowerCase().includes(term))
            );
        }

        return filtered;
    }, [searchQuery, moduleFilter, difficultyFilter, selectedQuestions]);

    // Calculate test stats
    const testStats = useMemo(() => {
        const totalQuestions = selectedQuestions.length;
        const totalPoints = selectedQuestions.reduce((sum, sq) => sum + sq.points, 0);
        const modules = Array.from(new Set(selectedQuestions.map((sq) => sq.question.module)));
        const estimatedDuration = selectedQuestions.length * 5; // rough estimate

        return {
            totalQuestions,
            totalPoints,
            modules,
            estimatedDuration,
        };
    }, [selectedQuestions]);

    const handleAddQuestion = (question: Question) => {
        const newOrder = selectedQuestions.length + 1;
        setSelectedQuestions([
            ...selectedQuestions,
            {
                questionId: question.id,
                question,
                points: 5, // default points
                order: newOrder,
            },
        ]);
    };

    const handleRemoveQuestion = (questionId: string) => {
        setSelectedQuestions(
            selectedQuestions
                .filter((sq) => sq.questionId !== questionId)
                .map((sq, idx) => ({ ...sq, order: idx + 1 }))
        );
    };

    const handleUpdatePoints = (questionId: string, points: number) => {
        setSelectedQuestions(
            selectedQuestions.map((sq) =>
                sq.questionId === questionId ? { ...sq, points: Math.max(1, points) } : sq
            )
        );
    };

    const handleReorder = (fromIndex: number, toIndex: number) => {
        const newQuestions = [...selectedQuestions];
        const [moved] = newQuestions.splice(fromIndex, 1);
        newQuestions.splice(toIndex, 0, moved);
        setSelectedQuestions(newQuestions.map((sq, idx) => ({ ...sq, order: idx + 1 })));
    };

    const handleSave = () => {
        // In real app, save to backend
        alert("Test saved successfully!");
        router.push(basePath);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="shrink-0"
                    aria-label="Back to tests list"
                >
                    <ArrowLeft className="size-4" />
                </Button>
                <PageHeader
                    title="Create New Test"
                    subtitle="Build a comprehensive PTE Academic practice test by selecting questions from your question bank"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form - Left Side (2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information Card */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <AppInput
                                label="Test Title"
                                placeholder="e.g., PTE Academic Full Mock Test - March 2026"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                requiredMark
                            />

                            <div>
                                <Label htmlFor="description" className="text-xs font-medium text-slate-600 mb-1.5 block">
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    placeholder="Provide a brief description of this test..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <AppInput
                                    label="Duration (minutes)"
                                    type="number"
                                    min="1"
                                    value={duration.toString()}
                                    onChange={(e) => setDuration(Number(e.target.value) || 60)}
                                    requiredMark
                                />

                                <AppInput
                                    label="Passing Score (%)"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={passingScore?.toString() || ""}
                                    onChange={(e) =>
                                        setPassingScore(e.target.value ? Number(e.target.value) : undefined)
                                    }
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <Label htmlFor="instructions" className="text-xs font-medium text-slate-600 mb-1.5 block">
                                    Instructions
                                </Label>
                                <textarea
                                    id="instructions"
                                    placeholder="Provide instructions for students taking this test..."
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px] resize-none"
                                />
                            </div>

                            <AppInput
                                label="Tags (comma-separated)"
                                placeholder="e.g., full-test, mock, practice"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                    </Card>

                    {/* Questions Card */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Test Questions</h2>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowQuestionSelector(!showQuestionSelector)}
                            >
                                <Plus className="size-4" />
                                Add Questions
                            </Button>
                        </div>

                        {selectedQuestions.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                                <FileQuestion className="size-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 mb-2">No questions added yet</p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowQuestionSelector(true)}
                                >
                                    <Plus className="size-4" />
                                    Add Your First Question
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedQuestions.map((sq, index) => {
                                    const moduleInfo = PTE_MODULES.find((m) => m.id === sq.question.module);
                                    return (
                                        <div
                                            key={sq.questionId}
                                            className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                                                {sq.order}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-slate-900 text-sm mb-1">
                                                            {sq.question.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {moduleInfo && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {moduleInfo.label}
                                                                </Badge>
                                                            )}
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs capitalize"
                                                            >
                                                                {sq.question.difficulty}
                                                            </Badge>
                                                            <span className="text-xs text-slate-500">
                                                                {sq.question.questionTypeLabel}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveQuestion(sq.questionId)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                                        aria-label="Remove question"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Label className="text-xs text-slate-600">Points:</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={sq.points}
                                                        onChange={(e) =>
                                                            handleUpdatePoints(sq.questionId, Number(e.target.value) || 1)
                                                        }
                                                        className="h-7 w-20 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>

                    {/* Question Selector Modal */}
                    <DraggableModal
                        open={showQuestionSelector}
                        onOpenChange={setShowQuestionSelector}
                        title="Select Questions"
                        description="Choose questions from your question bank to add to this test"
                        size="xl"
                        maxHeight="max-h-[85vh]"
                    >
                        <div className="space-y-4">
                            {/* Filters */}
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search questions..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <select
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value as PteModule | "all")}
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                                    aria-label="Filter by module"
                                >
                                    <option value="all">All Modules</option>
                                    {PTE_MODULES.map((mod) => (
                                        <option key={mod.id} value={mod.id}>
                                            {mod.label}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={difficultyFilter}
                                    onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | "all")}
                                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                                    aria-label="Filter by difficulty"
                                >
                                    <option value="all">All Difficulties</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            {/* Questions List */}
                            {availableQuestions.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileQuestion className="size-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500">No questions available</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Try adjusting your filters or add more questions to your question bank
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {availableQuestions.map((question) => {
                                        const moduleInfo = PTE_MODULES.find((m) => m.id === question.module);
                                        return (
                                            <div
                                                key={question.id}
                                                className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-slate-900 text-sm mb-1">
                                                        {question.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                                        {moduleInfo && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {moduleInfo.label}
                                                            </Badge>
                                                        )}
                                                        <Badge variant="secondary" className="text-xs capitalize">
                                                            {question.difficulty}
                                                        </Badge>
                                                        <span className="text-xs text-slate-500">
                                                            {question.questionTypeLabel}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 line-clamp-2">
                                                        {question.content}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        handleAddQuestion(question);
                                                        // Optionally close modal after adding
                                                        // setShowQuestionSelector(false);
                                                    }}
                                                    className="shrink-0"
                                                >
                                                    <Plus className="size-4" />
                                                    Add
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </DraggableModal>
                </div>

                {/* Sidebar - Right Side (1 column) */}
                <div className="space-y-6 sticky top-6 self-start">
                    {/* Test Summary Card */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Test Summary</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <FileQuestion className="size-4" />
                                    Questions
                                </span>
                                <span className="font-semibold text-slate-900">
                                    {testStats.totalQuestions}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <Award className="size-4" />
                                    Total Points
                                </span>
                                <span className="font-semibold text-slate-900">{testStats.totalPoints}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <Clock className="size-4" />
                                    Duration
                                </span>
                                <span className="font-semibold text-slate-900">{duration} min</span>
                            </div>
                            <div className="pt-4 border-t border-slate-200">
                                <Label className="text-xs font-medium text-slate-600 mb-2 block">Modules</Label>
                                <div className="flex flex-wrap gap-2">
                                    {testStats.modules.length === 0 ? (
                                        <span className="text-xs text-slate-400">No modules selected</span>
                                    ) : (
                                        testStats.modules.map((mod) => {
                                            const moduleInfo = PTE_MODULES.find((m) => m.id === mod);
                                            return (
                                                <Badge key={mod} variant="outline" className="text-xs">
                                                    {moduleInfo?.label || mod}
                                                </Badge>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Settings Card */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Settings</h2>
                        <div className="space-y-4">
                            <AppSelect
                                label="Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TestStatus)}
                                options={[
                                    { value: "draft", label: "Draft" },
                                    { value: "published", label: "Published" },
                                    { value: "scheduled", label: "Scheduled" },
                                    { value: "archived", label: "Archived" },
                                ]}
                            />

                            <div>
                                <Label className="text-xs font-medium text-slate-600 mb-2 block">
                                    Visibility
                                </Label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={isPublic}
                                            onChange={() => setIsPublic(true)}
                                            className="text-primary"
                                        />
                                        <span className="text-sm text-slate-700">Public</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={!isPublic}
                                            onChange={() => setIsPublic(false)}
                                            className="text-primary"
                                        />
                                        <span className="text-sm text-slate-700">Private</span>
                                    </label>
                                </div>
                            </div>

                            {status === "scheduled" && (
                                <>
                                    <AppInput
                                        label="Scheduled Start"
                                        type="datetime-local"
                                        value={scheduledStart}
                                        onChange={(e) => setScheduledStart(e.target.value)}
                                    />
                                    <AppInput
                                        label="Scheduled End"
                                        type="datetime-local"
                                        value={scheduledEnd}
                                        onChange={(e) => setScheduledEnd(e.target.value)}
                                    />
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Actions Card */}
                    <Card className="p-6">
                        <div className="space-y-3">
                            <Button
                                onClick={handleSave}
                                className="w-full"
                                disabled={!title || selectedQuestions.length === 0}
                            >
                                <Save className="size-4" />
                                Save Test
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
