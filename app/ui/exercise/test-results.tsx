import { TestResult } from "@/app/lib/definitions";

interface TestResultsProps {
  result: TestResult;
}

export default function TestResults({ result }: TestResultsProps) {
  const passRate = Math.round((result.score / result.maxScore) * 100);

  return (
    <div className="space-y-6">
      {/* 結果サマリー */}
      <div
        className={`p-6 rounded-lg ${
          result.passed ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`text-xl font-bold ${
                result.passed ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.passed ? "合格" : "不合格"}
            </h2>
            <p className="text-gray-600 mt-1">
              スコア: {result.score}/{result.maxScore} ({passRate}%)
            </p>
          </div>
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center ${
              result.passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {result.passed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* テスト詳細 */}
      <div>
        <h3 className="text-lg font-bold mb-4">テスト詳細</h3>
        <div className="space-y-4">
          {result.details.map((detail, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                detail.passed
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`mt-0.5 mr-3 h-5 w-5 rounded-full flex items-center justify-center ${
                    detail.passed ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {detail.passed ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      detail.passed ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {detail.testName}
                  </h4>
                  <p className="text-sm mt-1">{detail.message}</p>

                  {!detail.passed && detail.expected && detail.actual && (
                    <div className="mt-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-gray-700">
                            期待される結果:
                          </p>
                          <pre className="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                            {detail.expected}
                          </pre>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            実際の結果:
                          </p>
                          <pre className="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                            {detail.actual}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* フィードバック */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-2">フィードバック</h3>
        <p className="text-blue-700">{result.feedback}</p>
      </div>

      {/* 完了日時 */}
      <div className="text-right text-sm text-gray-500">
        テスト完了日時: {new Date(result.completedAt).toLocaleString()}
      </div>
    </div>
  );
}
