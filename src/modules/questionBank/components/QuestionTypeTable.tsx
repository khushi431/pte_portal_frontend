"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PteModule, QuestionTypeInfo } from "../types";
import { PTE_MODULES } from "../constants/modules";

interface QuestionTypeTableProps {
    initialTypes: QuestionTypeInfo[];
}

type EditableType = Pick<QuestionTypeInfo, "slug" | "label" | "description" | "module">;

export function QuestionTypeTable({ initialTypes }: QuestionTypeTableProps) {
    const [types, setTypes] = useState<QuestionTypeInfo[]>(initialTypes);
    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState<PteModule | "all">("all");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<EditableType | null>(null);

    const filtered = useMemo(() => {
        return types.filter((t) => {
            if (moduleFilter !== "all" && t.module !== moduleFilter) return false;
            if (!search.trim()) return true;
            const term = search.toLowerCase();
            return (
                t.label.toLowerCase().includes(term) ||
                t.slug.toLowerCase().includes(term) ||
                t.description.toLowerCase().includes(term)
            );
        });
    }, [types, search, moduleFilter]);

    const openCreate = () => {
        setEditing({
            slug: "",
            label: "",
            module: "reading",
            description: "",
        });
        setOpen(true);
    };

    const openEdit = (qt: QuestionTypeInfo) => {
        setEditing({
            ...qt,
        });
        setOpen(true);
    };

    const handleDelete = (qt: QuestionTypeInfo) => {
        if (!confirm(`Delete question type "${qt.label}"? This is only dummy data.`)) return;
        setTypes((prev) => prev.filter((t) => t.slug !== qt.slug));
    };

    const handleSave = () => {
        if (!editing) return;
        if (!editing.slug || !editing.label) {
            alert("Slug and label are required.");
            return;
        }

        setTypes((prev) => {
            const exists = prev.find((t) => t.slug === editing.slug);
            if (exists) {
                return prev.map((t) =>
                    t.slug === editing.slug
                        ? {
                            ...t,
                            ...editing,
                        }
                        : t,
                );
            }
            return [
                ...prev,
                {
                    ...editing,
                    // keep internal fields for now but they are not exposed in UI
                    shortLabel: editing.label,
                    icon: "CircleDot",
                    totalQuestions: 0,
                },
            ];
        });

        setOpen(false);
        setEditing(null);
    };

    const moduleOptions: { id: PteModule | "all"; label: string }[] = [
        { id: "all", label: "All Modules" },
        ...PTE_MODULES.map((m) => ({ id: m.id, label: m.label })),
    ];

    return (
        <div className="space-y-4">
            {/* Filters + Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex-1 max-w-md flex gap-2">
                    <Input
                        placeholder="Search by name, slug or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value as PteModule | "all")}
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                    >
                        {moduleOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={openCreate}>
                        <Plus className="size-4" />
                        Add Question Type
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80">
                            <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600 hidden md:table-cell">
                                Module
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-600 hidden lg:table-cell">
                                Description
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-6 text-center text-sm text-slate-500"
                                >
                                    No question types found. Try changing filters or add a new type.
                                </td>
                            </tr>
                        )}
                        {filtered.map((qt) => {
                            const moduleInfo = PTE_MODULES.find((m) => m.id === qt.module);
                            return (
                                <tr key={qt.slug} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-800">
                                                {qt.label}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                slug: {qt.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {moduleInfo && (
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                                    moduleInfo.bgColor,
                                                    moduleInfo.color,
                                                    moduleInfo.borderColor,
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "size-1.5 rounded-full",
                                                        moduleInfo.color.replace("text-", "bg-"),
                                                    )}
                                                />
                                                {moduleInfo.label}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell max-w-sm">
                                        <span className="text-xs text-slate-500 line-clamp-2">
                                            {qt.description}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => openEdit(qt)}
                                                title="Edit"
                                            >
                                                <Pencil className="size-3.5 text-slate-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() => handleDelete(qt)}
                                                title="Delete"
                                            >
                                                <Trash2 className="size-3.5 text-red-400" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Create / Edit sheet (dummy, in-memory) */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>
                            {editing?.slug && types.some((t) => t.slug === editing.slug)
                                ? "Edit Question Type"
                                : "Add Question Type"}
                        </SheetTitle>
                        <SheetDescription>
                            This is dummy configuration only and will not be persisted to a backend.
                        </SheetDescription>
                    </SheetHeader>
                    {editing && (
                        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600">
                                    Slug (unique id) *
                                </Label>
                                <Input
                                    value={editing.slug}
                                    onChange={(e) =>
                                        setEditing({ ...editing, slug: e.target.value })
                                    }
                                    placeholder="e.g. mcq-single-reading"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600">
                                    Name *
                                </Label>
                                <Input
                                    value={editing.label}
                                    onChange={(e) =>
                                        setEditing({ ...editing, label: e.target.value })
                                    }
                                    placeholder="e.g. MCQ – Single Answer"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600">
                                    Module
                                </Label>
                                <select
                                    value={editing.module}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            module: e.target.value as PteModule,
                                        })
                                    }
                                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-slate-700 outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
                                >
                                    {PTE_MODULES.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600">
                                    Description
                                </Label>
                                <textarea
                                    rows={3}
                                    value={editing.description}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
                                    placeholder="Short explanation of what this question type is."
                                />
                            </div>
                        </div>
                    )}
                    <SheetFooter>
                        <div className="flex w-full items-center justify-between gap-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    setEditing(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}

