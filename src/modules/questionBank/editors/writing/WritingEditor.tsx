"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppInput } from "@/components/ui/app-input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty, PteModule, QuestionTypeSlug } from "../../types";
import { QUESTION_TYPE_MAP } from "../../constants/questionTypes";

interface WritingEditorProps {
  module: PteModule;
  questionType: Extract<QuestionTypeSlug, "summarize-written-text" | "write-essay">;
}

export function WritingEditor({ module, questionType }: WritingEditorProps) {
  const typeInfo = QUESTION_TYPE_MAP[questionType];
  const isEssay = questionType === "write-essay";

  const [internalTitle, setInternalTitle] = useState("");
  const [passage, setPassage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [tags, setTags] = useState("");
  const [wordLimit, setWordLimit] = useState(isEssay ? "200-300" : "50-70");
  const [errors, setErrors] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmedTitle = internalTitle.trim();
    const trimmedPassage = passage.trim();
    const trimmedPrompt = prompt.trim();

    if (!trimmedTitle || !trimmedPrompt) {
      setErrors("Please enter an internal title and the student-facing prompt.");
      return;
    }

    if (isEssay && !trimmedPrompt) {
      setErrors("For essay questions, add a clear essay prompt.");
      return;
    }

    if (!trimmedPassage && questionType === "summarize-written-text") {
      setErrors("Summarize Written Text questions require a passage.");
      return;
    }

    setErrors(null);

    alert(
      `Writing question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${internalTitle}\nDifficulty: ${difficulty}\nWord limit: ${wordLimit}`,
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className="font-semibold uppercase text-slate-400">Module</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 capitalize">
            {module}
          </span>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span className="font-semibold uppercase text-slate-400">Type</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {typeInfo?.label}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 sm:text-xs max-w-md">
          {isEssay
            ? "Learner will write a 200–300 word essay based on your prompt."
            : "Learner will read the passage and write a one-sentence summary."}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.9fr)]">
        {/* Left: authoring form */}
        <div className="space-y-5">
          {/* Internal title */}
          <AppInput
            label="Internal Title *"
            placeholder={
              isEssay
                ? "e.g. Writing – Environment essay 1"
                : "e.g. Writing – SWT on space exploration"
            }
            value={internalTitle}
            onChange={(e) => setInternalTitle(e.target.value)}
            requiredMark
          />

          {/* Passage (main reading text) */}
          <div className="space-y-2">
            <Label
              htmlFor="writing-passage"
              className="text-sm font-medium text-slate-700"
            >
              Passage / Source Text
              {questionType === "summarize-written-text" && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </Label>
            <textarea
              id="writing-passage"
              rows={isEssay ? 5 : 7}
              placeholder={
                isEssay
                  ? "Optional: paste any reference text or background passage here..."
                  : "Paste the passage the learner will summarize..."
              }
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
            />
            <p className="text-xs text-slate-400">
              This text appears above the response box in the test player.
            </p>
          </div>

          {/* Student prompt / instructions */}
          <div className="space-y-2">
            <Label
              htmlFor="writing-prompt"
              className="text-sm font-medium text-slate-700"
            >
              Student Prompt / Instructions *
            </Label>
            <textarea
              id="writing-prompt"
              rows={isEssay ? 4 : 3}
              placeholder={
                isEssay
                  ? "e.g. \"You will have 20 minutes to write an essay on the given topic...\""
                  : "e.g. \"Write a one-sentence summary of the passage in 5–75 words.\""
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
            />
          </div>

          {/* Model answer / notes for teacher */}
          <div className="space-y-2">
            <Label
              htmlFor="writing-model-answer"
              className="text-sm font-medium text-slate-700"
            >
              Model Answer / Scoring Notes (optional)
            </Label>
            <textarea
              id="writing-model-answer"
              rows={4}
              placeholder={
                isEssay
                  ? "Add a sample high-scoring essay or rubric notes for evaluators..."
                  : "Add a sample good summary or key points you expect in the answer..."
              }
              value={modelAnswer}
              onChange={(e) => setModelAnswer(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
            />
          </div>

          {/* Difficulty + word limit + tags */}
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
            {/* Difficulty pills (reuse pattern from MCQ) */}
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

            {/* Word limit + tags stacked */}
            <div className="space-y-3">
              <AppInput
                label="Suggested Word Limit"
                value={wordLimit}
                onChange={(e) => setWordLimit(e.target.value)}
                description={
                  isEssay
                    ? "Default PTE range is 200–300 words."
                    : "Typical range is 50–70 words."
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <AppInput
              label="Tags"
              placeholder="e.g. writing, environment, practice test"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              description="Optional. Helps you search and group questions later."
            />
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

          {passage ? (
            <div className="mb-4 max-h-44 overflow-auto rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 shadow-xs">
              {passage}
            </div>
          ) : (
            <p className="mb-4 text-xs text-slate-400">
              Add a passage or background text on the left to preview it here.
            </p>
          )}

          <div className="space-y-3">
            <p className="font-medium text-slate-800">
              {prompt ||
                (isEssay
                  ? "Your essay prompt will appear here."
                  : "Your summary instructions will appear here.")}
            </p>
            <div className="rounded-lg bg-white px-3 py-3 text-xs text-slate-500 shadow-xs border border-slate-200">
              <p className="mb-1 font-medium text-slate-700">
                Response box (what the learner sees)
              </p>
              <p className="text-[11px] text-slate-500">
                The learner will type their {isEssay ? "essay" : "summary"} here during the
                test.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

