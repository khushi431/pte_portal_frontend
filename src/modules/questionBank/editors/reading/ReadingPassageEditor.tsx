"use client";

import React, { useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Shuffle, GripVertical } from "lucide-react";
import { Difficulty, PteModule, QuestionTypeSlug } from "../../types";
import { QUESTION_TYPE_MAP } from "../../constants/questionTypes";
import { cn } from "@/lib/utils";

interface ReadingPassageEditorProps {
    module: PteModule;
    questionType: QuestionTypeSlug; // expected: "reorder-paragraphs"
}

interface ReorderParagraph {
    id: string;
    text: string;
}

function SortableParagraph({
    item,
    index,
    onChange,
}: {
    item: ReorderParagraph;
    index: number;
    onChange: (value: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2",
                isDragging && "ring-2 ring-primary/40 bg-primary/5",
            )}
        >
            <button
                type="button"
                className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="size-4" />
            </button>
            <div className="flex-1 space-y-1">
                <Label className="text-xs font-semibold text-slate-500">
                    Paragraph {index + 1}
                </Label>
                <textarea
                    rows={3}
                    value={item.text}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                    placeholder="Type paragraph text here..."
                />
            </div>
        </div>
    );
}

export function ReadingPassageEditor({
    module,
    questionType,
}: ReadingPassageEditorProps) {
    const typeInfo = QUESTION_TYPE_MAP[questionType];

    const [title, setTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [paragraphs, setParagraphs] = useState<ReorderParagraph[]>([
        { id: "p-1", text: "" },
        { id: "p-2", text: "" },
        { id: "p-3", text: "" },
        { id: "p-4", text: "" },
    ]);
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [tags, setTags] = useState("");
    const [errors, setErrors] = useState<string | null>(null);

    const handleShuffle = () => {
        setParagraphs((prev) => {
            const shuffled = [...prev];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        });
    };

    const handleSubmit = () => {
        const trimmedTitle = title.trim();
        const nonEmpty = paragraphs.filter((p) => p.text.trim().length > 0);

        if (!trimmedTitle) {
            setErrors("Please add an internal title for this question.");
            return;
        }

        if (nonEmpty.length < 2) {
            setErrors("Add at least two non-empty paragraphs for the learner to reorder.");
            return;
        }

        setErrors(null);

        alert(
            `Reading Re-order Paragraphs created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${title}\nDifficulty: ${difficulty}\nParagraphs: ${nonEmpty.length}`,
        );
    };

    const updateParagraph = (index: number, value: string) => {
        const next = [...paragraphs];
        next[index] = { ...next[index], text: value };
        setParagraphs(next);
    };

    const addParagraph = () => {
        setParagraphs((prev) => {
            const nextIndex = prev.length + 1;
            return [...prev, { id: `p-${nextIndex}`, text: "" }];
        });
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
                    Enter the paragraphs in their correct order below. Learners will see them
                    shuffled and drag them to rearrange.
                </p>
            </div>

            {/* Two-column layout: authoring + preview */}
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)]">
                {/* Left: authoring form */}
                <div className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="ro-title" className="text-sm font-medium text-slate-700">
                            Internal Title *
                        </Label>
                        <Input
                            id="ro-title"
                            placeholder="Only visible inside the bank (e.g. Reorder – Internet History 01)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Intro / stem */}
                    <div className="space-y-2">
                        <Label htmlFor="ro-intro" className="text-sm font-medium text-slate-700">
                            Instructions / Intro Text
                        </Label>
                        <textarea
                            id="ro-intro"
                            rows={3}
                            placeholder="E.g. The text boxes below have been placed in a random order. Put the text boxes in the correct order."
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                        />
                    </div>

                    {/* Paragraphs authoring */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-slate-700">
                                Paragraphs (correct order)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="xs"
                                    onClick={addParagraph}
                                >
                                    Add paragraph
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="xs"
                                    onClick={handleShuffle}
                                >
                                    <Shuffle className="size-3" />
                                    Shuffle preview
                                </Button>
                            </div>
                        </div>
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={(event: DragEndEvent) => {
                                const { active, over } = event;
                                if (!over || active.id === over.id) return;
                                setParagraphs((items) => {
                                    const oldIndex = items.findIndex((p) => p.id === active.id);
                                    const newIndex = items.findIndex((p) => p.id === over.id);
                                    if (oldIndex === -1 || newIndex === -1) return items;
                                    return arrayMove(items, oldIndex, newIndex);
                                });
                            }}
                        >
                            <SortableContext
                                items={paragraphs.map((p) => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {paragraphs.map((p, idx) => (
                                        <SortableParagraph
                                            key={p.id}
                                            item={p}
                                            index={idx}
                                            onChange={(value) => updateParagraph(idx, value)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        <p className="text-xs text-slate-400">
                            This list represents the correct order. The test player can shuffle it
                            for each attempt.
                        </p>
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
                            <Label htmlFor="ro-tags" className="text-sm font-medium text-slate-700">
                                Tags
                            </Label>
                            <Input
                                id="ro-tags"
                                placeholder="e.g. reading, reorder, practice"
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

                {/* Right: student preview */}
                <div className="hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700 lg:block">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                        Student Preview
                    </p>
                    {intro && (
                        <p className="mb-3 text-xs text-slate-600">{intro}</p>
                    )}
                    <div className="space-y-3">
                        {paragraphs.filter((p) => p.text.trim().length > 0).length === 0 ? (
                            <p className="text-xs text-slate-400">
                                Add some paragraphs on the left to see how they will appear to the
                                learner.
                            </p>
                        ) : (
                            paragraphs
                                .filter((p) => p.text.trim().length > 0)
                                .map((p, idx) => (
                                    <div
                                        key={p.id}
                                        className="flex gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-xs"
                                    >
                                        <span className="mt-0.5 text-xs font-semibold text-slate-400">
                                            {idx + 1}
                                        </span>
                                        <span className="text-sm text-slate-700">{p.text}</span>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
