"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Job } from "@/app/lib/definitions";
import { quizzes } from "@/app/lib/quizzes";

interface JobFormProps {
  companyId: string;
  initialData?: Partial<Job>;
  onSubmit: (jobData: Partial<Job>) => Promise<void>;
}

export default function JobForm({
  companyId,
  initialData,
  onSubmit,
}: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiredQuizzes, setRequiredQuizzes] = useState<
    Array<{ quizId: string; minimumScore: number }>
  >([]);

  // フォームの状態
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    preferredSkills: "",
    location: "",
    employmentType: "full-time",
    experienceLevel: "mid",
    isActive: true,
    salaryMin: initialData?.salary?.min.toString() || "400000",
    salaryMax: initialData?.salary?.max.toString() || "700000",
    ...initialData,
  });

  // 初期データがある場合は必須テストも設定
  useEffect(() => {
    if (initialData?.requiredQuizzes) {
      setRequiredQuizzes(initialData.requiredQuizzes);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddQuiz = () => {
    setRequiredQuizzes((prev) => [...prev, { quizId: "", minimumScore: 70 }]);
  };

  const handleRemoveQuiz = (index: number) => {
    setRequiredQuizzes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuizChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setRequiredQuizzes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // フォームデータを求人データに変換
      const jobData: Partial<Job> = {
        companyId,
        title: formData.title,
        description: formData.description,
        requirements:
          typeof formData.requirements === "string"
            ? formData.requirements
                .split("\n")
                .filter((line) => line.trim() !== "")
            : formData.requirements,
        preferredSkills:
          typeof formData.preferredSkills === "string"
            ? formData.preferredSkills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "")
            : formData.preferredSkills,
        location: formData.location,
        employmentType: formData.employmentType as
          | "full-time"
          | "part-time"
          | "contract"
          | "internship",
        experienceLevel: formData.experienceLevel as "entry" | "mid" | "senior",
        salary: {
          min: parseInt(formData.salaryMin),
          max: parseInt(formData.salaryMax),
          currency: "JPY",
        },
        requiredQuizzes:
          requiredQuizzes.length > 0 ? requiredQuizzes : undefined,
        isActive: formData.isActive,
      };

      await onSubmit(jobData);
      router.push(`/companies/${companyId}/jobs`);
    } catch (err) {
      console.error("求人の保存中にエラーが発生しました:", err);
      setError("求人の保存中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          求人タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="例: フロントエンドエンジニア"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          求人詳細 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="仕事内容や企業の魅力などを記入してください"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            必須条件
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="各条件を改行で区切ってください"
          />
          <p className="mt-1 text-sm text-gray-500">
            各条件を改行で区切ってください
          </p>
        </div>

        <div>
          <label
            htmlFor="preferredSkills"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            歓迎スキル
          </label>
          <textarea
            id="preferredSkills"
            name="preferredSkills"
            value={formData.preferredSkills}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="React, TypeScript, Next.js"
          />
          <p className="mt-1 text-sm text-gray-500">
            カンマ(,)で区切ってください
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            勤務地 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="例: 東京（リモート可）"
          />
        </div>

        <div>
          <label
            htmlFor="employmentType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            雇用形態 <span className="text-red-500">*</span>
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="full-time">正社員</option>
            <option value="part-time">パートタイム</option>
            <option value="contract">契約社員</option>
            <option value="internship">インターンシップ</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="experienceLevel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            経験レベル <span className="text-red-500">*</span>
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="entry">未経験・エントリーレベル</option>
            <option value="mid">中級者</option>
            <option value="senior">シニアレベル</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          給与範囲（月給・円） <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            id="salaryMin"
            name="salaryMin"
            value={formData.salaryMin}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <span className="text-gray-500">〜</span>
          <input
            type="number"
            id="salaryMax"
            name="salaryMax"
            value={formData.salaryMax}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          必須スキルテスト
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          応募者に必要なスキルテストと最低スコアを設定できます。
        </p>

        {requiredQuizzes.map((quiz, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 mb-3 p-3 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              <select
                value={quiz.quizId}
                onChange={(e) =>
                  handleQuizChange(index, "quizId", e.target.value)
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">スキルテストを選択</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <div className="flex items-center">
                <input
                  type="number"
                  value={quiz.minimumScore}
                  onChange={(e) =>
                    handleQuizChange(
                      index,
                      "minimumScore",
                      parseInt(e.target.value)
                    )
                  }
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveQuiz(index)}
              className="text-red-600 hover:text-red-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuiz}
          className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          スキルテストを追加
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
          この求人を公開する
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "保存中..." : initialData ? "更新する" : "求人を作成"}
        </button>
      </div>
    </form>
  );
}
