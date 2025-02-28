import { NextRequest, NextResponse } from "next/server";
import { submitExercise } from "@/app/lib/exercises";
import { runTests, updateSubmissionStatus } from "@/app/lib/test-runner";

export async function POST(request: NextRequest) {
  try {
    // 認証部分を一時的に削除
    const userId = "temp-user-id"; // 一時的なユーザーID

    // リクエストボディの解析
    const body = await request.json();
    const { exerciseId, repositoryUrl } = body;

    if (!exerciseId || !repositoryUrl) {
      return NextResponse.json(
        { error: "演習IDとリポジトリURLは必須です" },
        { status: 400 }
      );
    }

    // 提出を保存
    const submission = await submitExercise(userId, exerciseId, repositoryUrl);

    // 非同期でテストを実行
    updateSubmissionStatus(submission.id, "testing")
      .then(() => runTests(submission))
      .then(() => updateSubmissionStatus(submission.id, "completed"))
      .catch((error) => {
        console.error("テスト実行中にエラーが発生しました:", error);
        updateSubmissionStatus(submission.id, "failed");
      });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("提出処理中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "提出処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
