'use client'
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import PromptInput from "../components/PromptInput";
import ResponseDisplay from "../components/ResponseDisplay";

interface LlmResult {
  answer: string;
  method: string;
}

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LlmResult | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold the AbortController for the current fetch request
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (result) {
      answerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const handleSubmit = async (prompt: string) => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setResult(null);
    
    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal, // Pass the signal to the fetch request
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed: ${response.status}`);
      }

      const data: LlmResult = await response.json();
      setResult(data);

    } catch (error: any) {
      // Check if the error was due to the request being aborted
      if (error.name === 'AbortError') {
        console.log('Fetch request was cancelled by the user.');
        toast.success("Request cancelled.");
      } else {
        console.error("Failed to generate response:", error);
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
      // Clean up the controller
      abortControllerRef.current = null;
    }
  };

  // New function to handle the cancellation
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const resetChat = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>LLM or Python Agent Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Ask anything.
        </h1>
        <p className="text-slate-500 font-medium mt-4">
          Code will return answer from LLM generated python code or normal LLM
        </p>

        <PromptInput 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          isLoading={isLoading} 
        />
        
        <Toaster position="top-center" reverseOrder={false} />
        

        <div ref={answerRef} className="space-y-10 w-full max-w-4xl">
          {result && (
            <ResponseDisplay
              answer={result.answer}
              method={result.method}
              onReset={resetChat}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;