 "use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty, PteModule, QuestionTypeSlug } from "../../types";
import { QUESTION_TYPE_MAP } from "../../constants/questionTypes";

interface MCQEditorProps {
    module: PteModule;
    questionType: QuestionTypeSlug; // expected: "mcq-single" | "mcq-multiple"
}

export function MCQEditor({ module, questionType }: MCQEditorProps) {
    const typeInfo = QUESTION_TYPE_MAP[questionType];
    const isMultipleChoice = questionType === "mcq-multiple";

    const [title, setTitle] = useState("");
    const [passage, setPassage] = useState("");
    const [questionPrompt, setQuestionPrompt] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [tags, setTags] = useState("");
    const [options, setOptions] = useState([
        { id: "a", text: "", isCorrect: false },
        { id: "b", text: "", isCorrect: false },
        { id: "c", text: "", isCorrect: false },
        { id: "d", text: "", isCorrect: false },
    ]);

    const addOption = () => {
        const nextId = String.fromCharCode(97 + options.length); // a, b, c...
        setOptions([...options, { id: nextId, text: "", isCorrect: false }]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const updateOption = (
        index: number,
        field: "text" | "isCorrect",
        value: string | boolean,
    ) => {
        const updated = [...options];
        if (field === "isCorrect" && !isMultipleChoice) {
            updated.forEach((opt, i) => {
                opt.isCorrect = i === index ? (value as boolean) : false;
            });
        } else {
            (updated[index] as Record<string, string | boolean>)[field] = value;
        }
        setOptions(updated);
    };

    const handleSubmit = () => {
        const selectedCorrect = options.filter((o) => o.isCorrect).map((o) => o.id.toUpperCase());
        alert(
            `Reading MCQ question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${title}\nDifficulty: ${difficulty}\nCorrect: ${selectedCorrect.join(
                ", ",
            ) || "none"}`,
        );
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-400">
                        Module:
                    </span>
                    <span className="text-sm font-medium text-slate-700 capitalize">
                        {module}
                    </span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-400">
                        Type:
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                        {typeInfo?.label}
                    </span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                    {isMultipleChoice
                        ? "Candidates can select more than one correct answer."
                        : "Candidates must select a single correct answer."}
                </span>
            </div>

            {/* Passage */}
            <div className="space-y-2">
                <Label htmlFor="reading-passage" className="text-sm font-medium text-slate-700">
                    Reading Passage
                </Label>
                <textarea
                    id="reading-passage"
                    rows={6}
                    placeholder="Paste or type the reading passage here..."
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                />
                <p className="text-xs text-slate-400">
                    This passage will appear above the multiple choice options.
                </p>
            </div>

            {/* Question prompt */}
            <div className="space-y-2">
                <Label htmlFor="mcq-question" className="text-sm font-medium text-slate-700">
                    Question Prompt *
                </Label>
                <textarea
                    id="mcq-question"
                    rows={3}
                    placeholder="Enter the question text that students will answer..."
                    value={questionPrompt}
                    onChange={(e) => setQuestionPrompt(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                />
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="mcq-title" className="text-sm font-medium text-slate-700">
                    Internal Title *
                </Label>
                <Input
                    id="mcq-title"
                    placeholder="Title used only inside the question bank (e.g. MCQ – Photosynthesis)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Options */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">
                        Answer Options{" "}
                        {isMultipleChoice ? "(select all correct)" : "(select one correct)"}
                    </Label>
                    <Button
                        variant="outline"
                        size="xs"
                        type="button"
                        onClick={addOption}
                    >
                        <Plus className="size-3" />
                        Add Option
                    </Button>
                </div>
                <div className="space-y-2">
                    {options.map((opt, index) => (
                        <div key={opt.id} className="flex items-center gap-3">
                            <input
                                type={isMultipleChoice ? "checkbox" : "radio"}
                                name="mcq-correct-option"
                                title={`Mark option ${opt.id.toUpperCase()} as correct`}
                                checked={opt.isCorrect}
                                onChange={(e) =>
                                    updateOption(index, "isCorrect", e.target.checked)
                                }
                                className="size-4 accent-primary"
                            />
                            <span className="text-sm font-medium text-slate-500 w-6">
                                {opt.id.toUpperCase()}.
                            </span>
                            <Input
                                placeholder={`Option ${opt.id.toUpperCase()}`}
                                value={opt.text}
                                onChange={(e) =>
                                    updateOption(index, "text", e.target.value)
                                }
                                className={cn(
                                    "flex-1",
                                    opt.isCorrect && "border-emerald-300 bg-emerald-50",
                                )}
                            />
                            {options.length > 2 && (
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    type="button"
                                    onClick={() => removeOption(index)}
                                >
                                    <Trash2 className="size-3.5 text-red-400" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                    Difficulty Level
                </Label>
                <div className="flex gap-2">
                    {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => setDifficulty(d)}
                            className={cn(
                                "rounded-lg px-4 py-2 text-sm font-medium border transition-all capitalize",
                                difficulty === d
                                    ? d === "easy"
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                        : d === "medium"
                                            ? "bg-amber-50 border-amber-300 text-amber-700"
                                            : "bg-red-50 border-red-300 text-red-700"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300",
                            )}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label htmlFor="mcq-tags" className="text-sm font-medium text-slate-700">
                    Tags
                </Label>
                <Input
                    id="mcq-tags"
                    placeholder="Enter comma-separated tags (e.g., science, reading, MCQ)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-slate-400">
                    These tags help you filter and organize questions later.
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button type="button" onClick={handleSubmit}>
                    <Save className="size-4" />
                    Save Question
                </Button>
                <Button variant="outline" type="button" onClick={handleSubmit}>
                    Save as Draft
                </Button>
            </div>
        </div>
    );
}
