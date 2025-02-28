/**
 * 日付を「YYYY年MM月DD日」形式でフォーマットする関数
 * @param date フォーマットする日付（Date オブジェクトまたは ISO 文字列）
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${year}年${month}月${day}日`;
}

/**
 * 日付を「YYYY/MM/DD」形式でフォーマットする関数（短い形式）
 * @param date フォーマットする日付（Date オブジェクトまたは ISO 文字列）
 * @returns フォーマットされた日付文字列
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");

  return `${year}/${month}/${day}`;
}
