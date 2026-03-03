import * as React from "react";
import { cn } from "@/lib/utils";

export type AppTableColumn<T> = {
    id: string;
    header: React.ReactNode;
    cell: (row: T, rowIndex: number) => React.ReactNode;
    thClassName?: string;
    tdClassName?: string;
};

interface AppTableProps<T> {
    data: T[];
    columns: AppTableColumn<T>[];
    getRowKey: (row: T, rowIndex: number) => string;
    emptyState?: React.ReactNode;
    containerClassName?: string;
    tableClassName?: string;
    headerRowClassName?: string;
    bodyClassName?: string;
    rowClassName?: (row: T, rowIndex: number) => string | undefined;
}

export function AppTable<T>({
    data,
    columns,
    getRowKey,
    emptyState = "No records found.",
    containerClassName,
    tableClassName,
    headerRowClassName,
    bodyClassName,
    rowClassName,
}: AppTableProps<T>) {
    return (
        <div
            className={cn(
                "overflow-x-auto rounded-xl border border-slate-200 bg-white",
                containerClassName
            )}
        >
            <table className={cn("w-full text-sm", tableClassName)}>
                <thead>
                    <tr
                        className={cn(
                            "bg-purple-600 text-white",
                            headerRowClassName
                        )}
                    >
                        {columns.map((col) => (
                            <th
                                key={col.id}
                                className={cn(
                                    "px-5 py-4 text-left text-sm font-semibold tracking-wide",
                                    col.thClassName
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className={cn("divide-y divide-slate-100", bodyClassName)}>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-5 py-10 text-center text-sm text-slate-500"
                            >
                                {emptyState}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr
                                key={getRowKey(row, idx)}
                                className={cn(
                                    "transition-colors",
                                    idx % 2 === 0 ? "bg-white" : "bg-purple-50",
                                    "hover:bg-purple-50/70",
                                    rowClassName?.(row, idx)
                                )}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.id}
                                        className={cn(
                                            "px-5 py-4 align-top text-slate-800",
                                            col.tdClassName
                                        )}
                                    >
                                        {col.cell(row, idx)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

