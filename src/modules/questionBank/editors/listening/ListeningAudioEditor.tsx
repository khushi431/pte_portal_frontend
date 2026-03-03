"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AppInput } from "@/components/ui/app-input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty, PteModule, QuestionTypeSlug } from "../../types";
import { QUESTION_TYPE_MAP } from "../../constants/questionTypes";

type ListeningQuestionSlug = Extract<
  QuestionTypeSlug,
  | "summarize-spoken-text"
  | "listening-mcq-single"
  | "listening-mcq-multiple"
  | "listening-fill-blanks"
  | "highlight-correct-summary"
  | "select-missing-word"
  | "highlight-incorrect-words"
  | "write-from-dictation"
>;

export interface ListeningEditorProps {
  module: PteModule;
  questionType: ListeningQuestionSlug;
}

export function ListeningEditor({
  module,
  questionType,
}: ListeningEditorProps) {
  const typeInfo = QUESTION_TYPE_MAP[questionType];

  const isMCQType =
    questionType === "listening-mcq-single" ||
    questionType === "listening-mcq-multiple" ||
    questionType === "highlight-correct-summary" ||
    questionType === "select-missing-word";
  const isMultiSelect =
    questionType === "listening-mcq-multiple" ||
    questionType === "highlight-correct-summary";
  const isSummarize = questionType === "summarize-spoken-text";
  const isFillBlanks = questionType === "listening-fill-blanks";
  const isHighlightIncorrect = questionType === "highlight-incorrect-words";
  const isDictation = questionType === "write-from-dictation";

  const [internalTitle, setInternalTitle] = useState("");
  const [audioNote, setAudioNote] = useState("");
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [tags, setTags] = useState("");
  const [options, setOptions] = useState(
    isMCQType
      ? [
          { id: "a", text: "", isCorrect: false },
          { id: "b", text: "", isCorrect: false },
          { id: "c", text: "", isCorrect: false },
          { id: "d", text: "", isCorrect: false },
        ]
      : [],
  );
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAudioFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setAudioError("Please upload a valid audio file (MP3, WAV, OGG).");
      setAudioFile(null);
      return;
    }
    setAudioError(null);
    setAudioFile(file);
    try {
      const url = URL.createObjectURL(file);
      setAudioPreviewUrl(url);
    } catch {
      // ignore preview errors
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleAudioFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleAudioFile(file);
  };

  const addOption = () => {
    const nextId = String.fromCharCode(97 + options.length); // a, b, c...
    setOptions([...options, { id: nextId, text: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean,
  ) => {
    const updated = [...options];
    if (field === "isCorrect" && !isMultiSelect) {
      updated.forEach((opt, i) => {
        opt.isCorrect = i === index ? (value as boolean) : false;
      });
    } else {
      (updated[index] as Record<string, string | boolean>)[field] = value;
    }
    setOptions(updated);
  };

  const handleSubmit = () => {
    const trimmedTitle = internalTitle.trim();
    const trimmedPrompt = prompt.trim();

    if (!trimmedTitle || !trimmedPrompt) {
      setErrors("Please enter an internal title and a student-facing prompt.");
      return;
    }

    if (!audioFile) {
      setErrors("Please attach an audio file for this listening question.");
      return;
    }

    if (isMCQType) {
      const filledOptions = options.filter((o) => o.text.trim().length > 0);
      const correct = options.filter((o) => o.isCorrect);

      if (filledOptions.length < 2) {
        setErrors("Add at least two answer options with some text.");
        return;
      }

      if (correct.length === 0) {
        setErrors("Mark at least one option as correct.");
        return;
      }

      if (!isMultiSelect && correct.length !== 1) {
        setErrors(
          "For single-answer listening MCQ, exactly one option should be marked correct.",
        );
        return;
      }
    }

    if (isDictation && !correctAnswer.trim()) {
      setErrors("For Write from Dictation, please provide the correct sentence.");
      return;
    }

    if (isSummarize && !transcript.trim()) {
      setErrors("Summarize Spoken Text usually requires a transcript or notes.");
      return;
    }

    setErrors(null);

    alert(
      `Listening question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${internalTitle}\nDifficulty: ${difficulty}`,
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className="font-semibold uppercase text-slate-400">Module</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 capitalize">
            {module}
          </span>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span className="font-semibold uppercase text-slate-400">Type</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {typeInfo?.label}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 sm:text-xs max-w-md">
          {isMCQType &&
            (isMultiSelect
              ? "Learner listens to the audio and selects all correct options."
              : "Learner listens to the audio and selects one correct option.")}
          {isSummarize &&
            "Learner listens to the recording and writes a short summary."}
          {isFillBlanks &&
            "Learner listens and fills in the missing words in the transcript."}
          {isHighlightIncorrect &&
            "Learner listens and highlights words in the transcript that differ from the audio."}
          {isDictation &&
            "Learner listens and types the sentence exactly as heard."}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.8fr)]">
        {/* Left: authoring form */}
        <div className="space-y-5">
          <AppInput
            label="Internal Title *"
            placeholder="Only visible to you (e.g. Listening – SST on climate change 1)"
            value={internalTitle}
            onChange={(e) => setInternalTitle(e.target.value)}
            requiredMark
          />

          {/* Audio upload area */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Audio File *
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
              aria-hidden="true"
              tabIndex={-1}
            />
            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 transition-colors",
                dragActive && "border-indigo-400 bg-indigo-50/60",
              )}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex-1 text-sm text-slate-500">
                {audioFile ? (
                  <span className="font-medium text-slate-700">
                    Selected: {audioFile.name}
                  </span>
                ) : (
                  <>
                    Drag & drop an audio file here, or{" "}
                    <button
                      type="button"
                      onClick={handleBrowseClick}
                      className="text-primary font-medium hover:underline"
                    >
                      browse
                    </button>
                    .
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Supported: MP3, WAV, OGG (max 10MB). The file is kept in memory for now;
              connect this to your storage/upload logic when you’re ready.
            </p>
            {audioError && (
              <p className="text-xs text-red-500">{audioError}</p>
            )}
            <AppInput
              label="Internal audio notes (optional)"
              placeholder="e.g. Source link, speaker name, recording notes..."
              value={audioNote}
              onChange={(e) => setAudioNote(e.target.value)}
            />
          </div>

          {/* Transcript / text area (for most listening types) */}
          {(isSummarize ||
            isFillBlanks ||
            isHighlightIncorrect ||
            isMCQType) && (
            <div className="space-y-2">
              <Label
                htmlFor="listening-transcript"
                className="text-sm font-medium text-slate-700"
              >
                Transcript / On-screen Text
              </Label>
              <textarea
                id="listening-transcript"
                rows={isFillBlanks || isHighlightIncorrect ? 6 : 4}
                placeholder={
                  isFillBlanks
                    ? "Paste the transcript and mark blanks (e.g. with ___ or {{blank}}) for the learner to fill."
                    : isHighlightIncorrect
                    ? "Paste the reference transcript the learner will read while listening."
                    : "Optional transcript or notes shown to the learner."
                }
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
              />
            </div>
          )}

          {/* Student prompt / instructions */}
          <div className="space-y-2">
            <Label
              htmlFor="listening-prompt"
              className="text-sm font-medium text-slate-700"
            >
              Student Prompt / Instructions *
            </Label>
            <textarea
              id="listening-prompt"
              rows={isSummarize || isDictation ? 3 : 2}
              placeholder={
                isSummarize
                  ? "e.g. \"You will hear a lecture. Write a summary of the spoken text in 50–70 words.\""
                  : isDictation
                  ? "e.g. \"You will hear a sentence. Type the sentence exactly as you hear it.\""
                  : "Explain clearly what the learner should do after listening."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
            />
          </div>

          {/* MCQ-style answer options */}
          {isMCQType && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-sm font-medium text-slate-700">
                  Answer Options{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {isMultiSelect
                      ? "Mark all correct answers"
                      : "Mark one correct answer"}
                  </span>
                </Label>
                <Button
                  variant="outline"
                  size="xs"
                  type="button"
                  onClick={addOption}
                >
                  <Plus className="size-3" />
                  Add option
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((opt, index) => (
                  <div key={opt.id} className="flex items-center gap-3">
                    <input
                      type={isMultiSelect ? "checkbox" : "radio"}
                      name="listening-correct-option"
                      title={`Mark option ${opt.id.toUpperCase()} as correct`}
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        updateOption(index, "isCorrect", e.target.checked)
                      }
                      className="size-4 accent-primary"
                    />
                    <span className="text-sm font-medium text-slate-500 w-6">
                      {opt.id.toUpperCase()}.
                    </span>
                    <AppInput
                      placeholder={`Option ${opt.id.toUpperCase()}`}
                      value={opt.text}
                      onChange={(e) =>
                        updateOption(index, "text", e.target.value)
                      }
                      className={cn(
                        "flex-1",
                        opt.isCorrect && "border-emerald-300 bg-emerald-50",
                      )}
                    />
                    {options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        type="button"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="size-3.5 text-red-400" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dictation: correct text answer */}
          {isDictation && (
            <AppInput
              label="Correct sentence *"
              placeholder="Type the sentence exactly as the learner should type it."
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              requiredMark
            />
          )}

          {/* Model answer / notes for summarize or highlight types */}
          {(isSummarize || isHighlightIncorrect) && (
            <div className="space-y-2">
              <Label
                htmlFor="listening-model-answer"
                className="text-sm font-medium text-slate-700"
              >
                Model Answer / Scoring Notes (optional)
              </Label>
              <textarea
                id="listening-model-answer"
                rows={4}
                placeholder={
                  isSummarize
                    ? "Add a sample high-scoring summary or rubric notes."
                    : "Explain which words are considered incorrect and how to score."
                }
                value={modelAnswer}
                onChange={(e) => setModelAnswer(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
              />
            </div>
          )}

          {/* Difficulty + Tags */}
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

          <AppInput
            label="Tags"
            placeholder="e.g. listening, sst, practice test"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            description="Optional. Helps you search and group questions later."
          />

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

          {/* Audio preview */}
          <div className="mb-4 rounded-lg bg-white px-3 py-3 shadow-xs border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              Audio player
            </p>
            {audioPreviewUrl ? (
              <audio
                controls
                className="w-full"
                src={audioPreviewUrl}
              >
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p className="text-[11px] text-slate-400">
                Select an audio file on the left to preview it here.
              </p>
            )}
          </div>

          {transcript ? (
            <div className="mb-4 max-h-40 overflow-auto rounded-lg bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 shadow-xs">
              {transcript}
            </div>
          ) : (
            <p className="mb-4 text-xs text-slate-400">
              Add a transcript or on-screen text on the left to see it here.
            </p>
          )}

          <div className="space-y-3">
            <p className="font-medium text-slate-800">
              {prompt || "Your listening instructions will appear here."}
            </p>

            {isMCQType && (
              <div className="space-y-2">
                {options
                  .filter((o) => o.text.trim().length > 0)
                  .map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-xs"
                    >
                      <span className="mt-0.5 text-xs font-semibold text-slate-500">
                        {opt.id.toUpperCase()}.
                      </span>
                      <span className="text-sm text-slate-700">
                        {opt.text}
                      </span>
                    </div>
                  ))}
                {options.filter((o) => o.text.trim().length > 0).length ===
                  0 && (
                  <p className="text-xs text-slate-400">
                    Add answer options to preview them here.
                  </p>
                )}
              </div>
            )}

            {isDictation && (
              <div className="rounded-lg bg-white px-3 py-3 text-xs text-slate-500 shadow-xs border border-slate-200">
                <p className="mb-1 font-medium text-slate-700">
                  Response box
                </p>
                <p className="text-[11px] text-slate-500">
                  The learner will type the dictated sentence here.
                </p>
              </div>
            )}

            {isSummarize && !isMCQType && !isDictation && (
              <div className="rounded-lg bg-white px-3 py-3 text-xs text-slate-500 shadow-xs border border-slate-200">
                <p className="mb-1 font-medium text-slate-700">
                  Summary response box
                </p>
                <p className="text-[11px] text-slate-500">
                  The learner will write their summary here during the test.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

