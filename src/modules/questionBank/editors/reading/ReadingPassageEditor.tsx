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
        const nonEmpty = paragraphs.filter((p) => p.text.trim().length > 0).length;
        alert(
            `Reading Re-order Paragraphs created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${title}\nDifficulty: ${difficulty}\nParagraphs: ${nonEmpty}`,
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
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="ro-title" className="text-sm font-medium text-slate-700">
                    Internal Title *
                </Label>
                <Input
                    id="ro-title"
                    placeholder="Title used only inside the question bank (e.g. Reorder – Internet History)"
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

            {/* Paragraphs */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-700">
                        Paragraphs (original correct order)
                    </Label>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={addParagraph}
                        >
                            Add Paragraph
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={handleShuffle}
                        >
                            <Shuffle className="size-3" />
                            Shuffle Preview
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
                    This list represents the correct order. During the test, paragraphs can be
                    shown in a random order for the student to re-arrange.
                </p>
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
                <Label htmlFor="ro-tags" className="text-sm font-medium text-slate-700">
                    Tags
                </Label>
                <Input
                    id="ro-tags"
                    placeholder="Enter comma-separated tags (e.g., technology, history, reorder)"
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
