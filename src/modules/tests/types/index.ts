import { Question, PteModule } from "@/modules/questionBank/types";

export type TestStatus = "draft" | "published" | "archived" | "scheduled";

export interface TestQuestion {
    questionId: string;
    question: Question;
    points: number;
    order: number;
}

export interface Test {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    totalQuestions: number;
    totalPoints: number;
    modules: PteModule[];
    questions: TestQuestion[];
    status: TestStatus;
    isPublic: boolean;
    scheduledStart?: string; // ISO date string
    scheduledEnd?: string; // ISO date string
    passingScore?: number; // percentage
    instructions?: string;
    tags: string[];
    createdBy: string; // user ID
    createdByName: string; // user name
    createdAt: string;
    updatedAt: string;
    completedCount?: number; // number of students who completed
    averageScore?: number; // average score percentage
}

export interface TestFilters {
    search: string;
    status: TestStatus | "all";
    module: PteModule | "all";
    isPublic: "all" | "public" | "private";
}
