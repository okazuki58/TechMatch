import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      question: "HTTPとは何の略？",
      options: [
        "HyperText Transfer Protocol",
        "High Tech Transfer Protocol",
        "Home Transfer Text Protocol",
      ],
      answer: 0,
    },
    {
      id: 2,
      question: "DNSの役割は？",
      options: [
        "IPアドレスをドメインに変換",
        "ウェブサイトを高速化",
        "サーバーを保護",
      ],
      answer: 0,
    },
    {
      id: 3,
      question: "JavaScriptでDOMを操作するためのメソッドは？",
      options: ["querySelector", "fetch", "setTimeout"],
      answer: 0,
    },
  ]);
}
