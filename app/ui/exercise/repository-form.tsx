"use client";

import { useState } from "react";

interface RepositoryFormProps {
  onSubmit: (repositoryUrl: string) => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function RepositoryForm({
  onSubmit,
  isSubmitting,
  error,
}: RepositoryFormProps) {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 基本的なバリデーション
    if (!repositoryUrl.trim()) {
      setValidationError("リポジトリURLを入力してください");
      return;
    }

    // GitHubのURLかどうかチェック
    const githubRegex = /^https:\/\/(github\.com|gitlab\.com)\/[\w-]+\/[\w-]+/;
    if (!githubRegex.test(repositoryUrl)) {
      setValidationError(
        "有効なGitHubまたはGitLabのリポジトリURLを入力してください"
      );
      return;
    }

    setValidationError(null);
    onSubmit(repositoryUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="repository-url"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          リポジトリURL
        </label>
        <input
          type="text"
          id="repository-url"
          placeholder="https://github.com/username/repository"
          value={repositoryUrl}
          onChange={(e) => setRepositoryUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
        {validationError && (
          <p className="mt-1 text-sm text-red-600">{validationError}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className={`px-6 py-2 bg-blue-600 text-white rounded-md font-medium ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              提出中...
            </div>
          ) : (
            "リポジトリを提出"
          )}
        </button>
      </div>
    </form>
  );
}
