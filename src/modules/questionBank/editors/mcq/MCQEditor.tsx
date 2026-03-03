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
    const [errors, setErrors] = useState<string | null>(null);

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
        // Basic friendly validation before "save"
        const trimmedTitle = title.trim();
        const trimmedPrompt = questionPrompt.trim();
        const filledOptions = options.filter((o) => o.text.trim().length > 0);
        const correctOptions = options.filter((o) => o.isCorrect);

        if (!trimmedTitle || !trimmedPrompt) {
            setErrors("Please add an internal title and a question prompt.");
            return;
        }

        if (filledOptions.length < 2) {
            setErrors("Add at least two answer options with some text.");
            return;
        }

        if (correctOptions.length === 0) {
            setErrors("Mark at least one option as correct.");
            return;
        }

        if (!isMultipleChoice && correctOptions.length !== 1) {
            setErrors("For single answer MCQ, exactly one option should be marked correct.");
            return;
        }

        setErrors(null);

        const selectedCorrect = correctOptions.map((o) => o.id.toUpperCase());
        alert(
            `Reading MCQ question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${title}\nDifficulty: ${difficulty}\nCorrect: ${selectedCorrect.join(
                ", ",
            )}`,
        );
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <span className="font-semibold uppercase text-slate-400">Module</span>
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 capitalize">
                        {module}
                    </span>
                    <span className="hidden text-slate-300 sm:inline">•</span>
                    <span className="font-semibold uppercase text-slate-400">Type</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {typeInfo?.label}
                    </span>
                </div>
                <p className="text-[11px] text-slate-500 sm:text-xs max-w-md">
                    {isMultipleChoice
                        ? "Learner can select more than one correct answer. Mark all correct options below."
                        : "Learner can select only one correct answer. Mark the single correct option below."}
                </p>
            </div>

            {/* Two-column authoring + preview */}
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)]">
                {/* Left: authoring form */}
                <div className="space-y-5">
                    {/* Internal title */}
                    <div className="space-y-2">
                        <Label htmlFor="mcq-title" className="text-sm font-medium text-slate-700">
                            Internal Title *
                        </Label>
                        <Input
                            id="mcq-title"
                            placeholder="Only visible to you (e.g. Read Aloud – Climate Change MCQ 1)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Passage */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="reading-passage"
                            className="text-sm font-medium text-slate-700"
                        >
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
                            This passage will appear above the MCQ in the test player.
                        </p>
                    </div>

                    {/* Question prompt */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="mcq-question"
                            className="text-sm font-medium text-slate-700"
                        >
                            Question Prompt *
                        </Label>
                        <textarea
                            id="mcq-question"
                            rows={3}
                            placeholder="What do you want the learner to answer?"
                            value={questionPrompt}
                            onChange={(e) => setQuestionPrompt(e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <Label className="text-sm font-medium text-slate-700">
                                Answer Options{" "}
                                <span className="text-xs font-normal text-slate-400">
                                    {isMultipleChoice
                                        ? "Mark all correct answers"
                                        : "Mark one correct answer"}
                                </span>
                            </Label>
                            <Button
                                variant="outline"
                                size="xs"
                                type="button"
                                onClick={addOption}
                            >
                                <Plus className="size-3" />
                                Add option
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

                    {/* Difficulty + Tags */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Difficulty */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                                Difficulty
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDifficulty(d)}
                                        className={cn(
                                            "rounded-lg px-3 py-1.5 text-xs font-medium border transition-all capitalize",
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
                                placeholder="e.g. reading, mcq, practice test"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                            <p className="text-[11px] text-slate-400">
                                Optional. Helps you search and group questions later.
                            </p>
                        </div>
                    </div>

                    {/* Errors */}
                    {errors && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {errors}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                        <Button type="button" onClick={handleSubmit}>
                            <Save className="size-4" />
                            Save question
                        </Button>
                        <Button variant="outline" type="button" onClick={handleSubmit}>
                            Save as draft
                        </Button>
                        <p className="text-[11px] text-slate-400">
                            You can always edit this question later from the question bank.
                        </p>
                    </div>
                </div>

                {/* Right: live preview */}
                <div className="hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700 lg:block">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                        Student Preview
                    </p>
                    {passage ? (
                        <div className="mb-4 max-h-40 overflow-auto rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 shadow-xs">
                            {passage}
                        </div>
                    ) : (
                        <p className="mb-4 text-xs text-slate-400">
                            Start typing a passage on the left to see how it will look here.
                        </p>
                    )}

                    <div className="space-y-3">
                        <p className="font-medium text-slate-800">
                            {questionPrompt || "Your question prompt will appear here."}
                        </p>
                        <div className="space-y-2">
                            {options
                                .filter((o) => o.text.trim().length > 0)
                                .map((opt) => (
                                    <div
                                        key={opt.id}
                                        className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-xs"
                                    >
                                        <span className="mt-0.5 text-xs font-semibold text-slate-500">
                                            {opt.id.toUpperCase()}.
                                        </span>
                                        <span className="text-sm text-slate-700">{opt.text}</span>
                                    </div>
                                ))}
                            {options.filter((o) => o.text.trim().length > 0).length === 0 && (
                                <p className="text-xs text-slate-400">
                                    Add answer options to preview them here.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
