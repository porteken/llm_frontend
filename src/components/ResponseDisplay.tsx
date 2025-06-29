'use client';
import ReactMarkdown from "react-markdown";

interface ResponseDisplayProps {
  answer: string;
  method: string;
  onReset: () => void;
}

export default function ResponseDisplay({ answer, method, onReset }: ResponseDisplayProps) {
  return (
    <>
      <div className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          Method used: <span className="text-blue-600 dark:text-blue-400 font-mono">{method}</span>
        </p>
        <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </div>
      <button
        className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-3 mt-5 hover:bg-black/80 w-full"
        onClick={onReset}
      >
        Ask Another Question
      </button>
    </>
  );
}