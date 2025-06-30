"use client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import PromptInput from "../components/PromptInput";
import ResponseDisplay from "../components/ResponseDisplay";
import { motion } from "framer-motion";

interface ResponseType {
  answer: string;
  code?: string;
}
const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResponseType | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

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

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `Request failed: ${response.status}`,
        );
      }

      const data: ResponseType = await response.json();
      setResult(data);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch request was cancelled by the user.");
        toast.success("Request cancelled.");
      } else {
        console.error("Failed to generate response:", error);
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

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
        <Toaster position="top-center" richColors />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-semibold"
        >
          Ask me anything
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.6 }}
          className="text-2xl text-zinc-500"
        >
          Code will return answer from LLM generated python code or normal LLM
        </motion.div>

        <PromptInput
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />

        <div ref={answerRef} className="space-y-10 w-full max-w-4xl">
          {result && <ResponseDisplay result={result} onReset={resetChat} />}
        </div>
      </main>
    </div>
  );
};

export default Home;
