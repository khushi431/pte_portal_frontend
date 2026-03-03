"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AppInput } from "@/components/ui/app-input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty, PteModule, QuestionTypeSlug } from "../../types";
import { QUESTION_TYPE_MAP } from "../../constants/questionTypes";

type SpeakingQuestionSlug = Extract<
  QuestionTypeSlug,
  | "read-aloud"
  | "repeat-sentence"
  | "describe-image"
  | "retell-lecture"
  | "answer-short-question"
>;

export interface SpeakingEditorProps {
  module: PteModule;
  questionType: SpeakingQuestionSlug;
}

export function SpeakingEditor({
  module,
  questionType,
}: SpeakingEditorProps) {
  const typeInfo = QUESTION_TYPE_MAP[questionType];

  const isReadAloud = questionType === "read-aloud";
  const isRepeatSentence = questionType === "repeat-sentence";
  const isDescribeImage = questionType === "describe-image";
  const isRetellLecture = questionType === "retell-lecture";
  const isShortQuestion = questionType === "answer-short-question";

  const [internalTitle, setInternalTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [audioNote, setAudioNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [tags, setTags] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleAudioBrowse = () => {
    audioInputRef.current?.click();
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleAudioFile(file);
  };

  const handleAudioDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleAudioDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleAudioDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleAudioFile(file);
  };

  const handleSubmit = () => {
    const trimmedTitle = internalTitle.trim();
    const trimmedPrompt = promptText.trim();

    if (!trimmedTitle || !trimmedPrompt) {
      setErrors("Please enter an internal title and the student-facing prompt/text.");
      return;
    }

    if (isShortQuestion && !expectedAnswer.trim()) {
      setErrors("For Answer Short Question, please add the expected short answer.");
      return;
    }

    setErrors(null);

    alert(
      `Speaking question created!\n\nModule: ${module}\nType: ${typeInfo?.label}\nTitle: ${internalTitle}\nDifficulty: ${difficulty}`,
    );
  };

  const promptLabel = (() => {
    if (isReadAloud) return "Reading Text *";
    if (isRepeatSentence) return "Sentence Script *";
    if (isDescribeImage) return "Image Caption / Description *";
    if (isRetellLecture) return "Lecture Notes / Script *";
    return "Prompt Text *";
  })();

  const promptPlaceholder = (() => {
    if (isReadAloud)
      return "Paste or type the text the learner will read aloud.";
    if (isRepeatSentence)
      return "Type the exact sentence the learner should repeat.";
    if (isDescribeImage)
      return "Describe what the image is about or add notes for yourself.";
    if (isRetellLecture)
      return "Paste the transcript or key notes for the lecture.";
    return "Write the instructions or question the learner will respond to.";
  })();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className="font-semibold uppercase text-slate-400">Module</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
            {module}
          </span>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span className="font-semibold uppercase text-slate-400">Type</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {typeInfo?.label}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 sm:text-xs max-w-md">
          {isReadAloud &&
            "Learner reads the text aloud. Provide the script and any internal notes."}
          {isRepeatSentence &&
            "Learner hears a sentence and repeats it. Provide the exact sentence script."}
          {isDescribeImage &&
            "Learner describes an image. Upload or reference an image and add helpful notes."}
          {isRetellLecture &&
            "Learner listens to a lecture and re-tells it. Provide transcript/notes and guidance."}
          {isShortQuestion &&
            "Learner hears a short question and answers with one word or a short phrase."}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.9fr)]">
        {/* Left: authoring form */}
        <div className="space-y-5">
          <AppInput
            label="Internal Title *"
            placeholder="Only visible to you (e.g. Speaking – Read Aloud on pollution 1)"
            value={internalTitle}
            onChange={(e) => setInternalTitle(e.target.value)}
            requiredMark
          />

          {/* Audio / media configuration */}
          <div className="space-y-3">
            {/* For audio-based types */}
            {(isReadAloud ||
              isRepeatSentence ||
              isRetellLecture ||
              isShortQuestion) && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Audio / Recording *
                </Label>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioChange}
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <div
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 transition-colors",
                    dragActive && "border-indigo-400 bg-indigo-50/60",
                  )}
                  onDragOver={handleAudioDragOver}
                  onDragEnter={handleAudioDragOver}
                  onDragLeave={handleAudioDragLeave}
                  onDrop={handleAudioDrop}
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
                          onClick={handleAudioBrowse}
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
                  Supported: MP3, WAV, OGG (max 10MB). The file is kept in memory for
                  now; connect this to your storage/upload logic when you’re ready.
                </p>
                {audioError && (
                  <p className="text-xs text-red-500">{audioError}</p>
                )}
              </div>
            )}

            {/* For image-based type */}
            {isDescribeImage && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Image
                </Label>
                <div className="flex items-center justify-center gap-3 p-6 rounded-lg border border-dashed border-slate-300 bg-slate-50">
                  <div className="text-center text-sm text-slate-500">
                    <p>Drag & drop an image here</p>
                    <p className="mt-1">
                      or{" "}
                      <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                      >
                        browse files
                      </button>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Supported: PNG, JPG, WEBP (max 5MB). Store the final URL in your
                  API.
                </p>
                <AppInput
                  label="Image URL (optional)"
                  placeholder="If you already have a hosted image URL, paste it here."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Main prompt / script */}
          <div className="space-y-2">
            <Label
              htmlFor="speaking-prompt"
              className="text-sm font-medium text-slate-700"
            >
              {promptLabel}
            </Label>
            <textarea
              id="speaking-prompt"
              rows={isRetellLecture ? 6 : 4}
              placeholder={promptPlaceholder}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
            />
          </div>

          {/* Expected answer for short question */}
          {isShortQuestion && (
            <AppInput
              label="Expected short answer *"
              placeholder='e.g. "Paris"'
              value={expectedAnswer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setExpectedAnswer(e.target.value)
              }
              requiredMark
              description="Used for evaluation/reference. Learner will answer via microphone."
            />
          )}

          {/* Model answer / notes */}
          <div className="space-y-2">
            <Label
              htmlFor="speaking-model-answer"
              className="text-sm font-medium text-slate-700"
            >
              Model Answer / Scoring Notes (optional)
            </Label>
            <textarea
              id="speaking-model-answer"
              rows={4}
              placeholder={
                isShortQuestion
                  ? "Add notes on what counts as correct / acceptable answers."
                  : "Add sample response, key points, or rubric for evaluators."
              }
              value={modelAnswer}
              onChange={(e) => setModelAnswer(e.target.value)}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none resize-y"
            />
          </div>

          {/* Audio notes (internal) */}
          <AppInput
            label="Internal notes (optional)"
            placeholder="e.g. microphone settings, timing, or reference material."
            value={audioNote}
            onChange={(e) => setAudioNote(e.target.value)}
          />

          {/* Difficulty + tags */}
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
            placeholder="e.g. speaking, read-aloud, practice test"
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

          {/* Media preview */}
          <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
            {(isReadAloud ||
              isRepeatSentence ||
              isRetellLecture ||
              isShortQuestion) && (
              <div className="rounded-lg bg-white px-3 py-3 shadow-xs border border-slate-200">
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
            )}

            {isDescribeImage && (
              <div className="rounded-lg bg-white px-3 py-3 shadow-xs border border-slate-200 flex items-center justify-center">
                <div className="h-24 w-32 rounded-md bg-slate-100 flex items-center justify-center text-[11px] text-slate-400">
                  Image preview
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="font-medium text-slate-800">
              {promptText ||
                (isReadAloud
                  ? "Your read aloud text will appear here."
                  : isRepeatSentence
                  ? "Your repeat sentence script will appear here."
                  : isDescribeImage
                  ? "Your image description / prompt will appear here."
                  : isRetellLecture
                  ? "Your lecture notes / script will appear here."
                  : "Your speaking prompt will appear here.")}
            </p>

            <div className="rounded-lg bg-white px-3 py-3 text-xs text-slate-500 shadow-xs border border-slate-200">
              <p className="mb-1 font-medium text-slate-700">
                Response (microphone)
              </p>
              <p className="text-[11px] text-slate-500">
                In the test player, the learner will respond using their
                microphone. This preview only shows the prompt and media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

