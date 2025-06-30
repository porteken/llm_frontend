"use client";
import { useState, useRef, useEffect } from "react";
import { ClipLoader } from "react-spinners";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function PromptInput({
  onSubmit,
  onCancel,
  isLoading,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-xl w-full mt-8">
      <div className="relative w-full">
        <div
          key="overview"
          className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
        ></div>
        <textarea
          id="prompt-textarea"
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask who JFK was or count the 'r's in 'Orange'"
          disabled={isLoading}
          rows={1}
          className="w-full p-4 pr-16 rounded-xl border ... resize-none overflow-y-hidden" // (shortened for brevity)
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center space-x-2">
          {isLoading ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="
                  flex items-center justify-center gap-2
                  w-auto h-10 px-4 py-2
                  text-sm font-semibold text-white bg-blue-600
                  rounded-lg
                  hover:bg-red-700
                  transition-colors
                "
                aria-label="Stop generating"
              >
                <ClipLoader color={"#ffffff"} size={20} />
                Stop
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="
                flex items-center justify-center
                w-auto h-10 px-4 py-2
                text-sm font-semibold text-white
                rounded-lg
                transition-colors
                bg-blue-600 hover:bg-blue-700
                disabled:bg-gray-400 disabled:cursor-not-allowed
              "
              aria-label="Run prompt"
            >
              {"Run Ctrl ↵"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
