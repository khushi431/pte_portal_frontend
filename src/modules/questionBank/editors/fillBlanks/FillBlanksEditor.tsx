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
    const [errors, setErrors] = useState<string | null>(null);

    const blanks = useMemo(() => extractBlanks(passage), [passage]);
    const [bankOrder, setBankOrder] = useState<string[]>([]);

    // Sync bank order whenever blanks change
    useEffect(() => {
        const validIds = blanks.map((b, idx) => `${b}-${idx}`);
        // Avoid cascading renders: only update when order actually changed
        setBankOrder((prev) => {
            const next = validIds.filter((id) => prev.includes(id));
            validIds.forEach((id) => {
                if (!next.includes(id)) next.push(id);
            });
            // If arrays are identical, return prev to skip re-render
            if (next.length === prev.length && next.every((id, i) => id === prev[i])) {
                return prev;
            }
            return next;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blanks.join(",")]);

    // Map id -> word for dnd list
    const idToWord = useMemo(() => {
        const map: Record<string, string> = {};
        blanks.forEach((b, idx) => {
            const id = `${b}-${idx}`;
            map[id] = b;
        });
        return map;
    }, [blanks]);

    const handleSubmit = () => {
        const trimmedTitle = title.trim();
        const trimmedPassage = passage.trim();

        if (!trimmedTitle || !trimmedPassage) {
            setErrors("Please add an internal title and a passage with blanks.");
            return;
        }

        if (blanks.length === 0) {
            setErrors("Add at least one blank using [[word]] in the passage.");
            return;
        }

        setErrors(null);

        alert(
            `Reading FIB question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${title}\nDifficulty: ${difficulty}\nBlanks: ${blanks.join(
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
                    {questionType === "fill-blanks-drag-drop"
                        ? "Learner drags words from a bank into the blanks. Use [[word]] in the passage to mark each blank."
                        : "Learner selects the correct word from dropdowns in each blank. Use [[word]] to define the correct answers."}
                </p>
            </div>

            {/* Two-column layout: authoring + preview */}
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)]">
                {/* Left: authoring form */}
                <div className="space-y-5">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="fib-title" className="text-sm font-medium text-slate-700">
                            Internal Title *
                        </Label>
                        <Input
                            id="fib-title"
                            placeholder="Only visible inside the bank (e.g. FIB – Ocean Currents 01)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="fib-instructions"
                            className="text-sm font-medium text-slate-700"
                        >
                            Instructions shown to student
                        </Label>
                        <Input
                            id="fib-instructions"
                            placeholder={
                                questionType === "fill-blanks-drag-drop"
                                    ? "Drag words from the box into the correct blanks."
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
                            <Label
                                htmlFor="fib-tags"
                                className="text-sm font-medium text-slate-700"
                            >
                                Tags
                            </Label>
                            <Input
                                id="fib-tags"
                                placeholder="e.g. reading, fib, vocabulary"
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

                {/* Right: live preview + word bank */}
                <div className="hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700 lg:block">
                    <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                        Student Preview
                    </p>
                    {instructions && (
                        <p className="mb-3 text-xs text-slate-600">{instructions}</p>
                    )}

                    {/* Passage preview with blanks */}
                    <div className="mb-4 max-h-44 overflow-auto rounded-lg bg-white px-3 py-2 text-sm leading-relaxed text-slate-700 shadow-xs">
                        {passage
                            ? passage.split(/(\[\[.+?\]\])/g).map((segment, idx) => {
                                  const match = segment.match(/^\[\[(.+?)\]\]$/);
                                  if (match) {
                                      return (
                                          <span
                                              key={idx}
                                              className="mx-0.5 inline-block min-w-[70px] border-b border-dashed border-slate-300 pb-0.5 text-purple-600 text-xs"
                                          >
                                              ______
                                          </span>
                                      );
                                  }
                                  return <span key={idx}>{segment}</span>;
                              })
                            : "Start typing a passage with [[blanks]] to see the preview here."}
                    </div>

                    {/* Word bank / dropdown options */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Word Bank ({blanks.length})
                        </p>
                        {blanks.length === 0 ? (
                            <p className="text-xs text-slate-400">
                                No blanks detected yet. Add [[word]] in the passage to create blanks.
                            </p>
                        ) : (
                            <>
                                <p className="text-xs text-slate-400 mb-1">
                                    Drag to change the order in which words appear to the learner.
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
                </div>
            </div>
        </div>
    );
}
