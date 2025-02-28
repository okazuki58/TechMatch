"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/contexts/auth-context";
import { getExerciseById, submitExercise } from "@/app/lib/exercises";
import { Exercise } from "@/app/lib/definitions";
import Navbar from "@/app/ui/navbar";
import RepositoryForm from "@/app/ui/exercise/repository-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { Components } from "react-markdown";

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function ExerciseDetailPage({
  params,
}: {
  params: { exerciseId: string };
}) {
  const { exerciseId } = params;
  const { user } = useAuth();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"instructions" | "setup">(
    "instructions"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderMarkdown = (content: string | undefined) => {
    if (!content) return <p>コンテンツがありません</p>;

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={
          {
            code({
              node,
              inline,
              className,
              children,
              ...props
            }: CodeBlockProps) {
              const match = /language-(\w+)/.exec(className || "");
              const code = String(children).replace(/\n$/, "");
              const [copied, setCopied] = useState(false);

              // コピー状態をリセットするタイマー
              useEffect(() => {
                if (copied) {
                  const timer = setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                  return () => clearTimeout(timer);
                }
              }, [copied]);

              if (!inline && match) {
                return (
                  <div className="relative group">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                        setCopied(true);
                      }}
                      className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied ? "コピーしました" : "コピー"}
                    </button>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              return (
                <code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              );
            },
          } as Components
        }
      >
        {content}
      </ReactMarkdown>
    );
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const data = await getExerciseById(exerciseId);
        setExercise(data);
        setIsLoading(false);
      } catch (error) {
        console.error("演習の取得に失敗しました:", error);
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  const handleSubmit = async (repositoryUrl: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submission = await submitExercise(
        user.id,
        exerciseId,
        repositoryUrl
      );
      router.push(
        `/exercises/${exerciseId}/results?submissionId=${submission.id}`
      );
    } catch (error) {
      console.error("提出に失敗しました:", error);
      setError(
        "リポジトリの提出に失敗しました。URLを確認して再度お試しください。"
      );
      setIsSubmitting(false);
    }
  };

  // 難易度の日本語表示
  const difficultyDisplay =
    exercise &&
    {
      beginner: "初級",
      intermediate: "中級",
      advanced: "上級",
    }[exercise.difficulty];

  // カテゴリの日本語表示
  type CategoryKey =
    | "frontend"
    | "backend"
    | "fullstack"
    | "database"
    | "devops";
  const categoryMap = {
    frontend: "フロントエンド",
    backend: "バックエンド",
    fullstack: "フルスタック",
    database: "データベース",
    devops: "DevOps",
  };
  const categoryDisplay = exercise
    ? categoryMap[exercise.category as CategoryKey] || exercise.category
    : "";

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (!exercise) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
          <h1 className="text-3xl font-bold mb-6">演習が見つかりません</h1>
          <p className="mb-6">
            指定された演習IDが存在しないか、削除された可能性があります。
          </p>
          <Link href="/exercises" className="text-blue-600 hover:underline">
            演習一覧に戻る
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/exercises"
            className="text-blue-600 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            演習一覧に戻る
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mr-4">
                {exercise.title}
              </h1>
              <div className="flex items-center mt-1 space-x-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {categoryDisplay}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    exercise.difficulty === "beginner"
                      ? "bg-green-100 text-green-800"
                      : exercise.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {difficultyDisplay}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{exercise.description}</p>

            <div className="flex mb-6">
              {exercise.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm mr-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("instructions")}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === "instructions"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  演習の説明
                </button>
                <button
                  onClick={() => setActiveTab("setup")}
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    activeTab === "setup"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  セットアップ手順
                </button>
              </nav>
            </div>

            <div className="prose max-w-none">
              {activeTab === "instructions"
                ? renderMarkdown(exercise?.instructions)
                : renderMarkdown(exercise?.setupGuide)}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">リポジトリを提出</h2>
              <p className="text-gray-600 mb-4">
                演習を完了したら、GitHubリポジトリのURLを提出してください。
                自動テストが実行され、結果が表示されます。
              </p>

              {!user && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        提出するには
                        <Link href="/login" className="font-medium underline">
                          ログイン
                        </Link>
                        が必要です。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <RepositoryForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
