import { QuizQuestion } from "../definitions";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question:
      "クライアント・サーバーモデルにおいて、「クライアント」として正しく分類されるものはどれですか？",
    category: "Web概論",
    options: [
      "Amazon AWS",
      "Webブラウザ",
      "Apache Webサーバー",
      "データベースサーバー",
    ],
    correctAnswerIndex: 1,
  },
  {
    id: "2",
    question: "HTTPSプロトコルの特徴として正しいものはどれですか？",
    category: "Web概論",
    options: [
      "データ通信が暗号化されない",
      "SSL/TLSを使用してデータを暗号化する",
      "通信速度がHTTPより常に遅い",
      "ファイル転送専用のプロトコル",
    ],
    correctAnswerIndex: 1,
  },
  {
    id: "3",
    question:
      "次のURLの構成要素のうち、「パス」に該当する部分はどれですか？ https://www.example.com/products/index.html?id=123",
    category: "Web概論",
    options: ["https://", "www.example.com", "/products/index.html", "?id=123"],
    correctAnswerIndex: 2,
  },
  {
    id: "4",
    question:
      "Webサイトにアクセスする際にDNSが果たす役割として最も適切なものはどれですか？",
    category: "Web概論",
    options: [
      "Webページの内容をキャッシュする",
      "ユーザー認証を行う",
      "ドメイン名をIPアドレスに変換する",
      "データの暗号化を行う",
    ],
    correctAnswerIndex: 2,
  },
  {
    id: "5",
    question:
      "HTTPステータスコードの「200」が示す意味として正しいものはどれですか？",
    category: "Web概論",
    options: [
      "リクエストが成功した",
      "リソースが見つからない",
      "サーバー内部エラーが発生した",
      "リダイレクトが必要",
    ],
    correctAnswerIndex: 0,
  },
];
