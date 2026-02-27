"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { PteModule, QuestionTypeSlug, Difficulty } from "../types";
import { QUESTION_TYPE_MAP } from "../constants/questionTypes";
import { cn } from "@/lib/utils";

interface QuestionFormProps {
    module: PteModule;
    questionType: QuestionTypeSlug;
    basePath: string;
}

export function QuestionForm({ module, questionType }: QuestionFormProps) {
    const typeInfo = QUESTION_TYPE_MAP[questionType];

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [passage, setPassage] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [tags, setTags] = useState("");
    const [options, setOptions] = useState([
        { id: "a", text: "", isCorrect: false },
        { id: "b", text: "", isCorrect: false },
        { id: "c", text: "", isCorrect: false },
        { id: "d", text: "", isCorrect: false },
    ]);
    const [correctAnswer, setCorrectAnswer] = useState("");

    // Determine which fields to show based on question type
    const showPassage = [
        "mcq-single",
        "mcq-multiple",
        "fill-blanks-drag-drop",
        "fill-blanks-reading-writing",
        "summarize-written-text",
        "highlight-incorrect-words",
    ].includes(questionType);

    const showOptions = [
        "mcq-single",
        "mcq-multiple",
        "listening-mcq-single",
        "listening-mcq-multiple",
        "highlight-correct-summary",
        "select-missing-word",
    ].includes(questionType);

    const showCorrectAnswer = [
        "answer-short-question",
        "write-from-dictation",
    ].includes(questionType);

    const showAudioUpload = [
        "repeat-sentence",
        "retell-lecture",
        "answer-short-question",
        "summarize-spoken-text",
        "listening-mcq-single",
        "listening-mcq-multiple",
        "listening-fill-blanks",
        "highlight-correct-summary",
        "select-missing-word",
        "highlight-incorrect-words",
        "write-from-dictation",
    ].includes(questionType);

    const showImageUpload = ["describe-image"].includes(questionType);

    const isMultipleChoice = [
        "mcq-multiple",
        "listening-mcq-multiple",
    ].includes(questionType);

    const addOption = () => {
        const nextId = String.fromCharCode(97 + options.length); // a, b, c, ...
        setOptions([...options, { id: nextId, text: "", isCorrect: false }]);
    };

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, field: "text" | "isCorrect", value: string | boolean) => {
        const updated = [...options];
        if (field === "isCorrect" && !isMultipleChoice) {
            // Single choice: uncheck all others
            updated.forEach((opt, i) => {
                opt.isCorrect = i === index ? (value as boolean) : false;
            });
        } else {
            (updated[index] as Record<string, string | boolean>)[field] = value;
        }
        setOptions(updated);
    };

    const handleSubmit = () => {
        // In a real app, this would POST to the API
        alert(
            `Question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${title}\nDifficulty: ${difficulty}`
        );
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-400">Module:</span>
                    <span className="text-sm font-medium text-slate-700 capitalize">{module}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-slate-400">Type:</span>
                    <span className="text-sm font-medium text-slate-700">{typeInfo?.label}</span>
                </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                    Question Title *
                </Label>
                <Input
                    id="title"
                    placeholder="Enter a descriptive title for this question"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Passage */}
            {showPassage && (
                <div className="space-y-2">
                    <Label htmlFor="passage" className="text-sm font-medium text-slate-700">
                        Passage / Text
                    </Label>
                    <textarea
                        id="passage"
                        rows={5}
                        placeholder="Enter the reading passage or text content..."
                        value={passage}
                        onChange={(e) => setPassage(e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                    />
                </div>
            )}

            {/* Content / Question prompt */}
            <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-slate-700">
                    Question Content / Prompt *
                </Label>
                <textarea
                    id="content"
                    rows={3}
                    placeholder="Enter the question text or instructions..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                />
            </div>

            {/* Audio Upload */}
            {showAudioUpload && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                        Audio File
                    </Label>
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50">
                        <div className="text-sm text-slate-500">
                            Drag & drop an audio file here, or{" "}
                            <button className="text-primary font-medium hover:underline">
                                browse
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">Supported: MP3, WAV, OGG (max 10MB)</p>
                </div>
            )}

            {/* Image Upload */}
            {showImageUpload && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                        Image
                    </Label>
                    <div className="flex items-center gap-3 p-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 justify-center">
                        <div className="text-sm text-slate-500 text-center">
                            <p>Drag & drop an image here</p>
                            <p className="mt-1">
                                or{" "}
                                <button className="text-primary font-medium hover:underline">
                                    browse files
                                </button>
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">Supported: PNG, JPG, WEBP (max 5MB)</p>
                </div>
            )}

            {/* Options */}
            {showOptions && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-slate-700">
                            Answer Options {isMultipleChoice ? "(select all correct)" : "(select one correct)"}
                        </Label>
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={addOption}
                            type="button"
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
                                    name="correct-option"
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
                                        opt.isCorrect && "border-emerald-300 bg-emerald-50"
                                    )}
                                />
                                {options.length > 2 && (
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => removeOption(index)}
                                        type="button"
                                    >
                                        <Trash2 className="size-3.5 text-red-400" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Correct Answer (text) */}
            {showCorrectAnswer && (
                <div className="space-y-2">
                    <Label htmlFor="correctAnswer" className="text-sm font-medium text-slate-700">
                        Correct Answer
                    </Label>
                    <Input
                        id="correctAnswer"
                        placeholder="Enter the correct answer..."
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                    />
                </div>
            )}

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
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                            )}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-slate-700">
                    Tags
                </Label>
                <Input
                    id="tags"
                    placeholder="Enter comma-separated tags (e.g., science, biology, exam)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-slate-400">Separate multiple tags with commas</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Button onClick={handleSubmit}>
                    <Save className="size-4" />
                    Save Question
                </Button>
                <Button variant="outline" onClick={() => handleSubmit()}>
                    Save as Draft
                </Button>
            </div>
        </div>
    );
}
