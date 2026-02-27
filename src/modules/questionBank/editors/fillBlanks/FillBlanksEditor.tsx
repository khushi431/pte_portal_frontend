"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Save } from "lucide-react";
import { Difficulty, PteModule, QuestionTypeSlug } from "../../types";
import { QUESTION_TYPE_MAP } from "../../constants/questionTypes";
import { cn } from "@/lib/utils";

interface FillBlanksEditorProps {
    module: PteModule;
    questionType: QuestionTypeSlug; // "fill-blanks-drag-drop" | "fill-blanks-reading-writing"
}

// Helper: extract all [[blank]] tokens from text
function extractBlanks(text: string): string[] {
    const matches = text.match(/\[\[(.+?)\]\]/g) ?? [];
    return matches.map((m) => m.replace("[[", "").replace("]]", ""));
}

interface BankItem {
    id: string;
    word: string;
}

function BankChip({ id, word }: BankItem) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <button
            ref={setNodeRef}
            style={style}
            type="button"
            {...attributes}
            {...listeners}
            className={cn(
                "text-xs rounded-md px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 cursor-grab active:cursor-grabbing",
                isDragging && "ring-2 ring-primary/40 bg-primary/5",
            )}
        >
            {word}
        </button>
    );
}

export function FillBlanksEditor({ module, questionType }: FillBlanksEditorProps) {
    const typeInfo = QUESTION_TYPE_MAP[questionType];
    const [title, setTitle] = useState("");
    const [instructions, setInstructions] = useState("");
    const [passage, setPassage] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [tags, setTags] = useState("");

    const blanks = useMemo(() => extractBlanks(passage), [passage]);
    const [bankOrder, setBankOrder] = useState<string[]>([]);

    // Map id -> word for dnd list
    const idToWord = useMemo(() => {
        const map: Record<string, string> = {};
        blanks.forEach((b, idx) => {
            const id = `${b}-${idx}`;
            map[id] = b;
            // Initialize order lazily if not present yet
            if (!bankOrder.includes(id)) {
                bankOrder.push(id);
            }
        });
        // Remove ids that no longer have a corresponding blank
        const validIds = blanks.map((b, idx) => `${b}-${idx}`);
        if (bankOrder.length !== validIds.length) {
            setBankOrder(validIds);
        }
        return map;
    }, [blanks, bankOrder]);

    const handleSubmit = () => {
        alert(
            `Reading FIB question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${title}\nDifficulty: ${difficulty}\nBlanks: ${blanks.join(
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
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="fib-title" className="text-sm font-medium text-slate-700">
                    Internal Title *
                </Label>
                <Input
                    id="fib-title"
                    placeholder="Title used only inside the question bank (e.g. FIB – Ocean Currents)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
                <Label htmlFor="fib-instructions" className="text-sm font-medium text-slate-700">
                    Instructions shown to student
                </Label>
                <Input
                    id="fib-instructions"
                    placeholder={
                        questionType === "fill-blanks-drag-drop"
                            ? "Drag words from the list to fill the blanks."
                            : "Select the correct option from each dropdown."
                    }
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                />
            </div>

            {/* Passage with blanks */}
            <div className="space-y-2">
                <Label htmlFor="fib-passage" className="text-sm font-medium text-slate-700">
                    Passage with Blanks *
                </Label>
                <textarea
                    id="fib-passage"
                    rows={8}
                    placeholder="Type the passage here and mark blanks using [[word]] syntax.\n\nExample: Ocean [[currents]] help regulate the Earth's [[climate]]."
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                />
                <p className="text-xs text-slate-400">
                    Use [[word]] to mark blanks. The editor will automatically detect them.
                </p>
            </div>

            {/* Detected blanks preview + DnD word bank */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Detected Blanks ({blanks.length})
                </p>
                {blanks.length === 0 ? (
                    <p className="text-xs text-slate-400">
                        No blanks detected yet. Add [[word]] in the passage to create blanks.
                    </p>
                ) : (
                    <>
                        <p className="text-xs text-slate-400">
                            Drag the chips below to reorder how words will appear in the word bank.
                        </p>
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={(event: DragEndEvent) => {
                                const { active, over } = event;
                                if (!over || active.id === over.id) return;
                                setBankOrder((items) => {
                                    const oldIndex = items.indexOf(active.id as string);
                                    const newIndex = items.indexOf(over.id as string);
                                    if (oldIndex === -1 || newIndex === -1) return items;
                                    return arrayMove(items, oldIndex, newIndex);
                                });
                            }}
                        >
                            <SortableContext
                                items={bankOrder}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex flex-wrap gap-1.5">
                                    {bankOrder.map((id) => (
                                        <BankChip key={id} id={id} word={idToWord[id]} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </>
                )}
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
                <Label htmlFor="fib-tags" className="text-sm font-medium text-slate-700">
                    Tags
                </Label>
                <Input
                    id="fib-tags"
                    placeholder="Enter comma-separated tags (e.g., ecology, reading, blanks)"
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
