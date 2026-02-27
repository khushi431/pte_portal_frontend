import { PteModule, QuestionTypeInfo, QuestionTypeSlug } from "../types";

export const QUESTION_TYPES: QuestionTypeInfo[] = [
    // ── Speaking ──────────────────────────
    {
        slug: "read-aloud",
        label: "Read Aloud",
        shortLabel: "RA",
        module: "speaking",
        description: "Read a text aloud with correct pronunciation and fluency",
        icon: "Volume2",
        totalQuestions: 42,
    },
    {
        slug: "repeat-sentence",
        label: "Repeat Sentence",
        shortLabel: "RS",
        module: "speaking",
        description: "Listen to a sentence and repeat it exactly",
        icon: "RotateCcw",
        totalQuestions: 56,
    },
    {
        slug: "describe-image",
        label: "Describe Image",
        shortLabel: "DI",
        module: "speaking",
        description: "Describe an image in detail within a time limit",
        icon: "Image",
        totalQuestions: 38,
    },
    {
        slug: "retell-lecture",
        label: "Re-tell Lecture",
        shortLabel: "RL",
        module: "speaking",
        description: "Listen to a lecture and re-tell it in your own words",
        icon: "GraduationCap",
        totalQuestions: 29,
    },
    {
        slug: "answer-short-question",
        label: "Answer Short Question",
        shortLabel: "ASQ",
        module: "speaking",
        description: "Listen and provide a short one-word or phrase answer",
        icon: "MessageCircle",
        totalQuestions: 65,
    },

    // ── Writing ───────────────────────────
    {
        slug: "summarize-written-text",
        label: "Summarize Written Text",
        shortLabel: "SWT",
        module: "writing",
        description: "Read a passage and write a one-sentence summary",
        icon: "FileText",
        totalQuestions: 34,
    },
    {
        slug: "write-essay",
        label: "Write Essay",
        shortLabel: "WE",
        module: "writing",
        description: "Write a 200-300 word essay on a given topic",
        icon: "Edit3",
        totalQuestions: 48,
    },

    // ── Reading ───────────────────────────
    {
        slug: "mcq-single",
        label: "MCQ – Single Answer",
        shortLabel: "MCQ-S",
        module: "reading",
        description: "Read a passage and choose a single correct answer",
        icon: "CircleDot",
        totalQuestions: 52,
    },
    {
        slug: "mcq-multiple",
        label: "MCQ – Multiple Answer",
        shortLabel: "MCQ-M",
        module: "reading",
        description: "Read a passage and choose multiple correct answers",
        icon: "CheckSquare",
        totalQuestions: 44,
    },
    {
        slug: "reorder-paragraphs",
        label: "Re-order Paragraphs",
        shortLabel: "RO",
        module: "reading",
        description: "Arrange text boxes in the correct order",
        icon: "ArrowUpDown",
        totalQuestions: 31,
    },
    {
        slug: "fill-blanks-drag-drop",
        label: "Fill in the Blanks (Drag & Drop)",
        shortLabel: "FIB-DD",
        module: "reading",
        description: "Drag words from a list to fill in the blanks",
        icon: "GripHorizontal",
        totalQuestions: 40,
    },
    {
        slug: "fill-blanks-reading-writing",
        label: "Fill in the Blanks (R&W)",
        shortLabel: "FIB-RW",
        module: "reading",
        description: "Select words from dropdowns to fill in the blanks",
        icon: "ChevronDown",
        totalQuestions: 47,
    },

    // ── Listening ─────────────────────────
    {
        slug: "summarize-spoken-text",
        label: "Summarize Spoken Text",
        shortLabel: "SST",
        module: "listening",
        description: "Listen to a recording and write a summary",
        icon: "FileAudio",
        totalQuestions: 26,
    },
    {
        slug: "listening-mcq-single",
        label: "MCQ – Single Answer",
        shortLabel: "L-MCQ-S",
        module: "listening",
        description: "Listen and choose a single correct answer",
        icon: "CircleDot",
        totalQuestions: 37,
    },
    {
        slug: "listening-mcq-multiple",
        label: "MCQ – Multiple Answer",
        shortLabel: "L-MCQ-M",
        module: "listening",
        description: "Listen and choose multiple correct answers",
        icon: "CheckSquare",
        totalQuestions: 33,
    },
    {
        slug: "listening-fill-blanks",
        label: "Fill in the Blanks",
        shortLabel: "L-FIB",
        module: "listening",
        description: "Listen and type the missing words",
        icon: "TextCursorInput",
        totalQuestions: 41,
    },
    {
        slug: "highlight-correct-summary",
        label: "Highlight Correct Summary",
        shortLabel: "HCS",
        module: "listening",
        description: "Listen and select the correct summary from options",
        icon: "Highlighter",
        totalQuestions: 28,
    },
    {
        slug: "select-missing-word",
        label: "Select Missing Word",
        shortLabel: "SMW",
        module: "listening",
        description: "Listen and select the missing word at the end",
        icon: "HelpCircle",
        totalQuestions: 35,
    },
    {
        slug: "highlight-incorrect-words",
        label: "Highlight Incorrect Words",
        shortLabel: "HIW",
        module: "listening",
        description: "Read along while listening and identify incorrect words",
        icon: "XCircle",
        totalQuestions: 39,
    },
    {
        slug: "write-from-dictation",
        label: "Write from Dictation",
        shortLabel: "WFD",
        module: "listening",
        description: "Listen and type the sentence exactly as heard",
        icon: "Keyboard",
        totalQuestions: 72,
    },
];

/** Get question types filtered by module */
export function getQuestionTypesByModule(module: PteModule): QuestionTypeInfo[] {
    return QUESTION_TYPES.filter((qt) => qt.module === module);
}

/** Get a question type by its slug */
export function getQuestionTypeBySlug(slug: QuestionTypeSlug): QuestionTypeInfo | undefined {
    return QUESTION_TYPES.find((qt) => qt.slug === slug);
}

/** Map of slug → question type info */
export const QUESTION_TYPE_MAP: Record<QuestionTypeSlug, QuestionTypeInfo> = Object.fromEntries(
    QUESTION_TYPES.map((qt) => [qt.slug, qt])
) as Record<QuestionTypeSlug, QuestionTypeInfo>;
