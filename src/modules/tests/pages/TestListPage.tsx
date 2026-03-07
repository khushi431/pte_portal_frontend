"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { TestFilters } from "../components/TestFilters";
import { TestGridView } from "../components/TestGridView";
import { TestListView } from "../components/TestListView";
import { TestViewModal } from "../components/TestViewModal";
import { DUMMY_TESTS } from "../data/dummyTests";
import { Test, TestStatus } from "../types";
import { PteModule } from "@/modules/questionBank/types";

interface TestListPageProps {
    basePath: string; // "/admin/tests" or "/teacher/tests"
}

type ViewMode = "grid" | "list";

export function TestListPage({ basePath }: TestListPageProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TestStatus | "all">("all");
    const [module, setModule] = useState<PteModule | "all">("all");
    const [isPublic, setIsPublic] = useState<"all" | "public" | "private">("all");
    const [previewTest, setPreviewTest] = useState<Test | null>(null);

    // Filter tests
    const filteredTests = useMemo(() => {
        let result = [...DUMMY_TESTS];

        if (status !== "all") {
            result = result.filter((t) => t.status === status);
        }

        if (module !== "all") {
            result = result.filter((t) => t.modules.includes(module));
        }

        if (isPublic !== "all") {
            result = result.filter((t) => (isPublic === "public" ? t.isPublic : !t.isPublic));
        }

        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(
                (t) =>
                    t.title.toLowerCase().includes(term) ||
                    t.description.toLowerCase().includes(term) ||
                    t.tags.some((tag) => tag.toLowerCase().includes(term))
            );
        }

        return result;
    }, [status, module, isPublic, search]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Tests"
                subtitle="Create and manage PTE Academic practice tests for your students"
                action={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={viewMode === "grid"
                                    ? "rounded-md bg-primary text-primary-foreground p-1.5 transition-colors"
                                    : "rounded-md p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                                }
                                aria-label="Grid view"
                                title="Grid view"
                            >
                                <Grid3x3 className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className={viewMode === "list"
                                    ? "rounded-md bg-primary text-primary-foreground p-1.5 transition-colors"
                                    : "rounded-md p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                                }
                                aria-label="List view"
                                title="List view"
                            >
                                <List className="size-4" />
                            </button>
                        </div>
                        <Link href={`${basePath}/create`}>
                            <Button size="sm">
                                <Plus className="size-4" />
                                Create Test
                            </Button>
                        </Link>
                    </div>
                }
            />

            {/* Filters + Content in one card */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                {/* Header: filters + summary */}
                <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4 border-b border-slate-100">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <TestFilters
                            search={search}
                            onSearchChange={setSearch}
                            status={status}
                            onStatusChange={setStatus}
                            module={module}
                            onModuleChange={setModule}
                            isPublic={isPublic}
                            onIsPublicChange={setIsPublic}
                        />
                        <p className="text-xs md:text-sm text-slate-500 md:text-right">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredTests.length}
                            </span>{" "}
                            test{filteredTests.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Content: Grid or List */}
                <div className="p-4 sm:p-5">
                    {filteredTests.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-slate-500">
                                No tests found. Create your first test to get started.
                            </p>
                        </div>
                    ) : viewMode === "grid" ? (
                        <TestGridView
                            tests={filteredTests}
                            basePath={basePath}
                            onView={(test) => setPreviewTest(test)}
                            onEdit={(test) => {
                                window.location.href = `${basePath}/${test.id}/edit`;
                            }}
                            onDelete={(test) => {
                                alert(`Delete test: ${test.title}?`);
                            }}
                        />
                    ) : (
                        <TestListView
                            tests={filteredTests}
                            basePath={basePath}
                            onView={(test) => setPreviewTest(test)}
                            onEdit={(test) => {
                                window.location.href = `${basePath}/${test.id}/edit`;
                            }}
                            onDelete={(test) => {
                                alert(`Delete test: ${test.title}?`);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Test View Modal */}
            <TestViewModal
                test={previewTest}
                open={!!previewTest}
                onOpenChange={(open) => !open && setPreviewTest(null)}
            />
        </div>
    );
}
