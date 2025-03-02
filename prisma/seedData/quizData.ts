export const quizData = [
  {
    name: "Web概論クイズ",
    description: "Webの仕組みや関連技術についての基礎知識を問うクイズです",
    category: "Web開発",
    difficulty: "easy",
    badge: {
      create: {
        name: "Web基礎マスター",
        description: "Webの基礎知識をマスターした証",
        imageUrl: "/badges/web-basics.svg",
      },
    },
    questions: {
      create: [
        {
          question: "Webページの表示に関する基本的な技術として正しいものは？",
          category: "Web概論",
          options: [
            "HTMLはページの構造、CSSはデザイン、JavaScriptは動的な機能を担当する",
            "HTMLはデザイン、CSSは構造、JavaScriptはサーバー機能を担当する",
            "HTMLはサーバー処理、CSSは構造、JavaScriptはデザインを担当する",
            "HTMLは動的機能、CSSはサーバー処理、JavaScriptは構造を担当する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "HTTPとHTTPSの違いとして正しいものは？",
          category: "Web概論",
          options: [
            "HTTPSは通信を暗号化しているが、HTTPは暗号化していない",
            "HTTPSはよりスピードが速いが、HTTPはセキュリティが高い",
            "HTTPSはバックエンド専用で、HTTPはフロントエンド専用のプロトコル",
            "HTTPSはモバイル用で、HTTPはデスクトップ用のプロトコル",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "DNSの主な役割は何か？",
          category: "Web概論",
          options: [
            "ドメイン名をIPアドレスに変換する",
            "HTTPリクエストを暗号化する",
            "Webページをキャッシュする",
            "データベースの接続を管理する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "フロントエンドとバックエンドの違いとして正しいものは？",
          category: "Web概論",
          options: [
            "フロントエンドはユーザーが直接操作する部分、バックエンドはサーバー側の処理を担当する",
            "フロントエンドはデータベース、バックエンドはユーザーインターフェース",
            "フロントエンドは古い技術、バックエンドは最新の技術を指す",
            "フロントエンドはデスクトップアプリ、バックエンドはモバイルアプリを指す",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "ブラウザの開発者ツールで主にできることは？",
          category: "Web概論",
          options: [
            "HTML/CSS/JavaScriptのデバッグやネットワーク通信の確認",
            "ウェブサイトの自動作成",
            "サーバーのプログラミング",
            "データベースの直接編集",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "レスポンシブデザインとは何か？",
          category: "Web概論",
          options: [
            "さまざまな画面サイズに適応するWebデザイン手法",
            "応答速度が速いサーバーの設計手法",
            "キーボードとマウスの入力に反応するデザイン",
            "アニメーションを多用したWebデザイン",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "CSSセレクタの基本的な使い方として正しいものは？",
          category: "Web概論",
          options: [
            ".class-nameはクラス、#id-nameはIDを選択する",
            ".id-nameはID、#class-nameはクラスを選択する",
            "@class-nameはクラス、@id-nameはIDを選択する",
            "$class-nameはクラス、$id-nameはIDを選択する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Webサイトを公開するために必要なものは？",
          category: "Web概論",
          options: [
            "ドメイン名とWebホスティングサービス",
            "大規模なデータセンター",
            "独自のDNSサーバー",
            "政府の許可証",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "URLの構造として正しいものはどれか？",
          category: "Web概論",
          options: [
            "プロトコル://ドメイン名/パス?クエリパラメータ#フラグメント",
            "ドメイン名://プロトコル/パス?フラグメント#クエリパラメータ",
            "パス://プロトコル/ドメイン名?フラグメント#クエリパラメータ",
            "クエリパラメータ://ドメイン名/プロトコル?パス#フラグメント",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "HTML5の新機能として正しくないものはどれか？",
          category: "Web概論",
          options: [
            "SQLデータベースの組み込み機能",
            "キャンバス要素（canvas）",
            "ビデオ・オーディオ要素",
            "セマンティック要素（header, footer, article など）",
          ],
          correctAnswerIndex: 0,
        },
      ],
    },
  },
  {
    name: "Gitとチーム開発クイズ",
    description: "Git操作とチーム開発の知識を問うクイズです",
    category: "Git",
    difficulty: "medium",
    badge: {
      create: {
        name: "Git達人バッジ",
        description: "Gitとチーム開発のスキルを証明するバッジ",
        imageUrl: "/badges/git-master.svg",
      },
    },
    questions: {
      create: [
        {
          question:
            "Gitでブランチを新規作成し、そのブランチに切り替えるコマンドは？",
          category: "Gitとチーム開発",
          options: [
            "git checkout -b branch-name",
            "git branch new branch-name",
            "git create branch-name",
            "git switch --create branch-name",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Gitでコンフリクトが発生するのはどのような時か？",
          category: "Gitとチーム開発",
          options: [
            "複数の人が同じファイルの同じ部分を異なる方法で変更した場合",
            "同じブランチで作業している場合",
            "GitHubにプッシュした後",
            "コミットメッセージが長すぎる場合",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Gitで変更をコミットする前に必要な操作は？",
          category: "Gitとチーム開発",
          options: [
            "git add <ファイル名>でステージングエリアに追加する",
            "git push origin master を実行する",
            "git pull を実行する",
            "git commit --prepare を実行する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Git Flowにおけるfeatureブランチの役割は？",
          category: "Gitとチーム開発",
          options: [
            "新機能の開発用ブランチ",
            "本番環境用ブランチ",
            "リリース準備用ブランチ",
            "緊急バグ修正用ブランチ",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "GitHubのPull Requestの主な目的は？",
          category: "Gitとチーム開発",
          options: [
            "変更をレビューしてからマージするよう依頼すること",
            "リモートリポジトリから最新の変更を取得すること",
            "ブランチを強制的に削除すること",
            "コードの実行テストを自動化すること",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Gitリポジトリのフォークとは何か？",
          category: "Gitとチーム開発",
          options: [
            "他人のリポジトリのコピーを自分のアカウントに作成すること",
            "リポジトリを削除すること",
            "ローカルリポジトリを複数作成すること",
            "ブランチを分岐させること",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "チーム開発でのコードレビューの主な目的として適切でないものは？",
          category: "Gitとチーム開発",
          options: [
            "チームメンバーの評価を行うこと",
            "コードの品質を向上させること",
            "バグやエラーを早期に発見すること",
            "知識の共有を促進すること",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "GitHubでIssueを使う主な目的は？",
          category: "Gitとチーム開発",
          options: [
            "タスク、機能追加、バグなどを記録・追跡すること",
            "プロジェクトのリリース日を設定すること",
            "コードの自動テストを実行すること",
            "チームメンバーにメッセージを送ること",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Gitで過去のコミットの履歴を確認するコマンドは？",
          category: "Gitとチーム開発",
          options: [
            "git log",
            "git history",
            "git show-commits",
            "git list-all",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "タスク管理ツールの主な役割として適切でないものは？",
          category: "Gitとチーム開発",
          options: [
            "ソースコードを自動的に最適化すること",
            "タスクの進捗状況を可視化すること",
            "タスクの優先順位を管理すること",
            "チームメンバー間の作業分担を明確にすること",
          ],
          correctAnswerIndex: 0,
        },
      ],
    },
  },
  {
    name: "プログラミング基礎クイズ",
    description: "プログラミングの基本的な概念と知識を問うクイズです",
    category: "プログラミング",
    difficulty: "easy",
    badge: {
      create: {
        name: "プログラミング基礎マスター",
        description: "プログラミングの基礎知識をマスターした証",
        imageUrl: "/badges/programming-basics.svg",
      },
    },
    questions: {
      create: [
        {
          question: "変数とは何か？",
          category: "プログラミング基礎",
          options: [
            "データを格納するためのメモリ上の名前付きの場所",
            "プログラムの実行速度を変化させる設定",
            "関数の別名",
            "コードを実行する環境",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "条件分岐を表すプログラミング構文として一般的なものは？",
          category: "プログラミング基礎",
          options: ["if-else文", "each文", "while文", "def文"],
          correctAnswerIndex: 0,
        },
        {
          question: "配列（Array）の特徴として正しいものは？",
          category: "プログラミング基礎",
          options: [
            "複数の値を順序付けて格納するデータ構造",
            "キーと値のペアを格納するデータ構造",
            "オブジェクト指向言語でのみ使用できるデータ構造",
            "計算式を格納するためのデータ構造",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "ループ処理の目的は？",
          category: "プログラミング基礎",
          options: [
            "同じ処理を繰り返し実行するため",
            "プログラムを高速化するため",
            "メモリ使用量を増やすため",
            "バグを自動的に修正するため",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "アルゴリズムとは何か？",
          category: "プログラミング基礎",
          options: [
            "問題を解決するための明確な手順や方法",
            "プログラミング言語の一種",
            "コンピュータのハードウェア部品",
            "データベースの種類",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "FizzBuzzプログラムの一般的なルールとして正しいものは？",
          category: "プログラミング基礎",
          options: [
            "3の倍数ではFizz、5の倍数ではBuzz、両方の倍数ではFizzBuzzを出力する",
            "偶数ではFizz、奇数ではBuzzを出力する",
            "素数ではFizz、それ以外ではBuzzを出力する",
            "正の数ではFizz、負の数ではBuzzを出力する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "ハッシュ（連想配列）とは何か？",
          category: "プログラミング基礎",
          options: [
            "キーと値のペアを格納するデータ構造",
            "数値のみを格納できるデータ構造",
            "関数を定義するための構造",
            "コンピュータのメモリを直接操作するための構造",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "プログラミングにおける「デバッグ」の意味は？",
          category: "プログラミング基礎",
          options: [
            "プログラム内のエラーや問題を見つけて修正すること",
            "プログラムを高速化すること",
            "プログラムのコードを暗号化すること",
            "プログラムをインターネットに公開すること",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Gitのコミットとは何か？",
          category: "プログラミング基礎",
          options: [
            "リポジトリに加えた変更を記録したスナップショット",
            "コードを共有するためのウェブサイト",
            "エラーメッセージの一種",
            "プログラムを実行するためのコマンド",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "GitHub上のリポジトリとは何か？",
          category: "プログラミング基礎",
          options: [
            "コードやファイルを保存・管理する場所",
            "プログラムをコンパイルするツール",
            "エラーを自動的に修正するサービス",
            "チームメンバーを管理するためのツール",
          ],
          correctAnswerIndex: 0,
        },
      ],
    },
  },
  {
    name: "Ruby基礎クイズ",
    description: "Rubyの基本的な文法と機能を問うクイズです",
    category: "Ruby",
    difficulty: "medium",
    badge: {
      create: {
        name: "Ruby基礎マスター",
        description: "Rubyの基礎知識をマスターした証",
        imageUrl: "/badges/ruby-basics.svg",
      },
    },
    questions: {
      create: [
        {
          question: "Rubyでの変数定義の正しい方法は？",
          category: "Ruby基礎",
          options: [
            'name = "John"',
            'var name = "John";',
            'string name = "John";',
            'name := "John"',
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyにおける配列の作成方法として正しいものは？",
          category: "Ruby基礎",
          options: [
            "numbers = [1, 2, 3, 4, 5]",
            "numbers = array(1, 2, 3, 4, 5)",
            "numbers = Array<Integer>(1, 2, 3, 4, 5)",
            "numbers = {1, 2, 3, 4, 5}",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyのハッシュの作成方法として正しいものは？",
          category: "Ruby基礎",
          options: [
            'person = { "name" => "John", "age" => 30 }',
            'person = ["name" = "John", "age" = 30]',
            'person = hash("name": "John", "age": 30)',
            'person = <"name": "John", "age": 30>',
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyのシンボルとは何か？",
          category: "Ruby基礎",
          options: [
            "名前付きの不変のオブジェクトで、コードの中で一意の識別子として使用される",
            "数学的な計算を行うための特殊な変数",
            "メソッドの戻り値を表す特殊なキーワード",
            "Rubyプログラムのエントリーポイント",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyでのメソッド定義の正しい構文は？",
          category: "Ruby基礎",
          options: [
            'def greeting\n  puts "Hello"\nend',
            'function greeting() {\n  puts "Hello"\n}',
            'method greeting {\n  puts "Hello"\n}',
            'define greeting() => {\n  puts "Hello"\n}',
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyのクラス定義の正しい方法は？",
          category: "Ruby基礎",
          options: [
            "class Person\n  def initialize(name)\n    @name = name\n  end\nend",
            "class Person {\n  constructor(name) {\n    this.name = name;\n  }\n}",
            "class Person:\n  def __init__(self, name):\n    self.name = name",
            "struct Person {\n  name: String\n}",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyにおけるインスタンス変数の表記方法は？",
          category: "Ruby基礎",
          options: [
            "@variable_name",
            "self.variable_name",
            "$variable_name",
            "@@variable_name",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyでの継承の表現方法として正しいものは？",
          category: "Ruby基礎",
          options: [
            "class Student < Person",
            "class Student extends Person",
            "class Student inherits Person",
            "class Student : Person",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyでファイルを読み込む基本的な方法は？",
          category: "Ruby基礎",
          options: [
            "File.open('sample.txt', 'r') do |file|\n  content = file.read\nend",
            "content = readFile('sample.txt')",
            "content = File.readContent('sample.txt')",
            "with open('sample.txt', 'r') as file:\n  content = file.read()",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Rubyの特徴として正しくないものは？",
          category: "Ruby基礎",
          options: [
            "静的型付け言語である",
            "すべてがオブジェクトである",
            "メタプログラミングが可能である",
            "ガベージコレクションを備えている",
          ],
          correctAnswerIndex: 0,
        },
      ],
    },
  },
  {
    name: "Rails基礎クイズ",
    description: "Ruby on Railsの基本的な機能と使い方を問うクイズです",
    category: "Ruby on Rails",
    difficulty: "medium",
    badge: {
      create: {
        name: "Rails基礎マスター",
        description: "Ruby on Railsの基礎知識をマスターした証",
        imageUrl: "/badges/rails-basics.svg",
      },
    },
    questions: {
      create: [
        {
          question: "Ruby on Railsの基本的なアーキテクチャは？",
          category: "Rails基礎",
          options: [
            "MVC（Model-View-Controller）アーキテクチャ",
            "MVVM（Model-View-ViewModel）アーキテクチャ",
            "クライアント・サーバーアーキテクチャ",
            "マイクロサービスアーキテクチャ",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsでデータベースのテーブルを作成するために使用するのは？",
          category: "Rails基礎",
          options: [
            "マイグレーション（migration）ファイル",
            "モデル（model）ファイル",
            "ビュー（view）ファイル",
            "コントローラ（controller）ファイル",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Railsのルーティングの定義場所として正しいものは？",
          category: "Rails基礎",
          options: [
            "config/routes.rb",
            "app/routes/main.rb",
            "routes/application.rb",
            "config/application.rb",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Railsでモデルを作成するコマンドとして正しいものは？",
          category: "Rails基礎",
          options: [
            "rails generate model User name:string email:string",
            "rails create model User name:string email:string",
            "rails new model User name:string email:string",
            "rails add model User name:string email:string",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "RailsのERBテンプレートで、評価結果を出力する記法は？",
          category: "Rails基礎",
          options: ["<%= 式 %>", "<% 式 %>", "<? 式 ?>", "{{ 式 }}"],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsのコントローラーで、ビューに変数を渡す一般的な方法は？",
          category: "Rails基礎",
          options: [
            "@instance_variable = value",
            "@@class_variable = value",
            "$global_variable = value",
            "set_view_variable(name, value)",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsのフォームヘルパーで、POSTリクエストを送信するフォームを作成する基本的な方法は？",
          category: "Rails基礎",
          options: [
            "form_with model: @user do |form| ... end",
            "make_form for: @user do |form| ... end",
            "create_form using: @user do |form| ... end",
            "post_form with: @user do |form| ... end",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Railsにおける「ストロングパラメータ」の主な目的は？",
          category: "Rails基礎",
          options: [
            "マスアサインメント脆弱性からの保護",
            "データベースのパフォーマンス最適化",
            "ビューのレンダリング高速化",
            "セッション情報の暗号化",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsでデータベースのシードデータを作成する場所として正しいのは？",
          category: "Rails基礎",
          options: [
            "db/seeds.rb",
            "config/seeds.rb",
            "app/models/seeds.rb",
            "database/seeds.rb",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Railsアプリケーションを新規作成するコマンドは？",
          category: "Rails基礎",
          options: [
            "rails new application_name",
            "rails create application_name",
            "rails generate application_name",
            "rails make application_name",
          ],
          correctAnswerIndex: 0,
        },
      ],
    },
  },
  {
    name: "データベースとSQLクイズ",
    description: "データベースとSQLの基礎知識を問うクイズです",
    category: "データベース",
    difficulty: "medium",
    badge: {
      create: {
        name: "データベースマスター",
        description: "データベースとSQLの基礎知識をマスターした証",
        imageUrl: "/badges/database-master.svg",
      },
    },
    questions: {
      create: [
        {
          question: "リレーショナルデータベースの基本的な構成要素は？",
          category: "データベースとSQL",
          options: [
            "テーブル、行、列",
            "オブジェクト、メソッド、プロパティ",
            "ファイル、レコード、フィールド",
            "タグ、属性、値",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "複数のテーブルからデータを取得する際に使用するSQL句は？",
          category: "データベースとSQL",
          options: ["JOIN", "COMBINE", "MERGE", "CONNECT"],
          correctAnswerIndex: 0,
        },
        {
          question: "主キー（Primary Key）の特徴として正しいものは？",
          category: "データベースとSQL",
          options: [
            "テーブル内で各行を一意に識別する",
            "複数のテーブルを連結する",
            "常に自動的に割り当てられる",
            "データの暗号化に使用される",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "外部キー（Foreign Key）の主な役割は？",
          category: "データベースとSQL",
          options: [
            "異なるテーブル間の関連性を確立する",
            "テーブル内の行を一意に識別する",
            "データの検索速度を向上させる",
            "テーブルのレコード数を制限する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "データベースのINDEXの主な目的は？",
          category: "データベースとSQL",
          options: [
            "データの検索・取得を高速化する",
            "データのセキュリティを強化する",
            "データの重複を防止する",
            "データのバックアップを取る",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "SQLで新しいレコードをテーブルに追加するための構文は？",
          category: "データベースとSQL",
          options: ["INSERT INTO", "ADD TO", "UPDATE", "CREATE IN"],
          correctAnswerIndex: 0,
        },
        {
          question:
            "データベースのトランザクションの特性を表す「ACID」の「A」は何を表すか？",
          category: "データベースとSQL",
          options: [
            "Atomicity（原子性）",
            "Availability（可用性）",
            "Authentication（認証）",
            "Authorization（承認）",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "SQLで複数の条件を組み合わせる際に使用する論理演算子として正しいものは？",
          category: "データベースとSQL",
          options: [
            "AND、OR、NOT",
            "WITH、ALSO、EXCEPT",
            "PLUS、MINUS、COMPLEMENT",
            "IF、THEN、ELSE",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "データベースの正規化の主な目的は？",
          category: "データベースとSQL",
          options: [
            "データの冗長性を減らし、整合性を向上させる",
            "データの取得速度を向上させる",
            "データの暗号化レベルを高める",
            "データのバックアップ容量を削減する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "SQLインジェクションとは何か？",
          category: "データベースとSQL",
          options: [
            "ユーザー入力を通じてSQLクエリを改ざんする攻撃",
            "データベースの速度を向上させるための技術",
            "大量のデータを一度にデータベースに挿入する方法",
            "新しいデータベースの作成方法",
          ],
          correctAnswerIndex: 0,
        },
      ],
    },
  },
  {
    name: "Rails応用クイズ",
    description: "Ruby on Railsの応用的な知識とテクニックを問うクイズです",
    category: "Ruby on Rails",
    difficulty: "hard",
    badge: {
      create: {
        name: "Rails上級バッジ",
        description: "Ruby on Railsの応用知識をマスターした証",
        imageUrl: "/badges/rails-advanced.svg",
      },
    },
    questions: {
      create: [
        {
          question: "Deviseの主な機能は？",
          category: "Rails応用",
          options: [
            "ユーザー認証（登録、ログイン、パスワードリセットなど）の機能を提供する",
            "データベースのパフォーマンスを最適化する",
            "JavaScriptコードを自動的に生成する",
            "REST APIを自動的に生成する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "RESTful APIのHTTPメソッドとCRUDの対応として正しいものは？",
          category: "Rails応用",
          options: [
            "GET=Read, POST=Create, PUT/PATCH=Update, DELETE=Delete",
            "GET=Create, POST=Read, PUT/PATCH=Delete, DELETE=Update",
            "GET=Update, POST=Delete, PUT/PATCH=Create, DELETE=Read",
            "GET=Delete, POST=Update, PUT/PATCH=Read, DELETE=Create",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "Ajaxの主な利点は？",
          category: "Rails応用",
          options: [
            "ページ全体を再読み込みせずに部分的なコンテンツを更新できる",
            "データベースのクエリを最適化できる",
            "サーバーの負荷を常に軽減できる",
            "すべてのブラウザで一貫した表示を保証する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "RSpecとは何か？",
          category: "Rails応用",
          options: [
            "Rubyのテスティングフレームワーク",
            "Railsのパフォーマンス監視ツール",
            "JavaScriptとRailsを連携させるライブラリ",
            "APIの仕様を自動生成するツール",
          ],
          correctAnswerIndex: 0,
        },
        {
          question: "RailsでJSONレスポンスを返す基本的な方法は？",
          category: "Rails応用",
          options: [
            "render json: @data",
            "response.json(@data)",
            "json_output(@data)",
            "return_json(@data)",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsアプリケーションでのテスト駆動開発（TDD）のプロセスとして正しい順序は？",
          category: "Rails応用",
          options: [
            "失敗するテストを書く → 最小限のコードを実装して成功させる → リファクタリングする",
            "コードを書く → テストを書く → バグを修正する",
            "リファクタリングする → テストを書く → コードを修正する",
            "テストケースを考える → アプリケーションを実装する → テストを書く",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsでの非同期処理を実装する際によく使われるJavaScriptライブラリは？",
          category: "Rails応用",
          options: ["jQuery", "Angular", "React Native", "Swift UI"],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsアプリケーションでのユーザーセッション管理は主にどのように行われるか？",
          category: "Rails応用",
          options: [
            "クッキーとセッションストアを使用する",
            "すべてのリクエストでユーザー名とパスワードを送信する",
            "IPアドレスのみでユーザーを識別する",
            "すべてのユーザーデータをブラウザのローカルストレージに保存する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "RailsでのJavaScriptアセットパイプラインの役割として正しいものは？",
          category: "Rails応用",
          options: [
            "JavaScriptファイルを連結、最小化、圧縮して配信する",
            "JavaScriptコードを自動的に生成する",
            "JavaScriptのバグを自動的に検出して修正する",
            "すべてのJavaScriptコードをRubyに変換する",
          ],
          correctAnswerIndex: 0,
        },
        {
          question:
            "Railsアプリケーションにおけるセキュリティ対策として適切でないものは？",
          category: "Rails応用",
          options: [
            "すべてのパスワードをプレーンテキストでデータベースに保存する",
            "CSRFトークンを使用する",
            "ユーザー入力のサニタイズを行う",
            "セキュリティアップデートを定期的に適用する",
          ],
          correctAnswerIndex: 0,
        },
      ],
    },
  },
];
