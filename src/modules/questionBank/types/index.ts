export type PteModule = "speaking" | "writing" | "reading" | "listening";

export type QuestionTypeSlug =
    // Speaking
    | "read-aloud"
    | "repeat-sentence"
    | "describe-image"
    | "retell-lecture"
    | "answer-short-question"
    // Writing
    | "summarize-written-text"
    | "write-essay"
    // Reading
    | "mcq-single"
    | "mcq-multiple"
    | "reorder-paragraphs"
    | "fill-blanks-drag-drop"
    | "fill-blanks-reading-writing"
    // Listening
    | "summarize-spoken-text"
    | "listening-mcq-single"
    | "listening-mcq-multiple"
    | "listening-fill-blanks"
    | "highlight-correct-summary"
    | "select-missing-word"
    | "highlight-incorrect-words"
    | "write-from-dictation";

export type Difficulty = "easy" | "medium" | "hard";

export interface PteModuleInfo {
    id: PteModule;
    label: string;
    description: string;
    icon: string; // lucide icon name for reference
    color: string; // tailwind color class
    bgColor: string;
    borderColor: string;
}

export interface QuestionTypeInfo {
    slug: QuestionTypeSlug;
    label: string;
    shortLabel: string;
    module: PteModule;
    description: string;
    icon: string;
    totalQuestions: number;
}

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    title: string;
    module: PteModule;
    questionType: QuestionTypeSlug;
    questionTypeLabel: string;
    difficulty: Difficulty;
    content: string;
    options?: QuestionOption[];
    correctAnswer?: string;
    audioUrl?: string;
    imageUrl?: string;
    passage?: string;
    status: "active" | "draft" | "archived";
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
