export const jobData = [
  {
    id: "job-001",
    companyId: "company-001",
    title: "フロントエンドエンジニア",
    description: `
      当社では急成長中のプロダクト開発チームにおいて、ユーザー体験を革新するフロントエンドエンジニアを募集しています。
      
      あなたはReactとNext.jsを駆使して、数百万人のユーザーが日々利用する直感的なインターフェースを設計・開発していただきます。私たちのチームでは最新のWeb技術を積極的に採用し、パフォーマンスと美しさを両立させたプロダクト開発に取り組んでいます。
      
      リモートワーク可能な柔軟な勤務体制と、週1回のオフィスでのコラボレーションデーを組み合わせ、メンバー同士の絆を大切にしながらも自由な働き方を実現しています。経験豊富なシニアエンジニアによるメンタリングプログラムもあり、技術的成長をサポートします。
      
      私たちと一緒に、次世代のデジタル体験を創造しませんか？
    `,
    requirements: [
      "HTML/CSS/JavaScriptの堅固な基礎知識",
      "Reactを使った実務経験（1年以上）",
      "GitHubを活用したチーム開発の経験",
      "ユーザー体験とデザインへの情熱",
    ],
    preferredSkills: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "パフォーマンス最適化の経験",
      "アクセシビリティへの理解",
    ],
    location: "東京（週4リモート可）",
    employmentType: "full-time",
    experienceLevel: "mid",
    salary: {
      min: 500000,
      max: 800000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-001",
        minimumScore: 70,
      },
    ],
    postedAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01"),
    isActive: true,
    imageUrl: "/jobs/job01.jpg",
  },
  {
    id: "job-002",
    companyId: "company-002",
    title: "バックエンドエンジニア（未経験可）",
    description: `
      フューチャーデベロップメントでは、急速に成長するスタートアップを支援するバックエンドエンジニアを募集しています。

      私たちのチームでは、Node.jsとExpressを用いたRESTful APIの開発から、データベース設計、クラウドインフラの構築まで幅広い業務に携わることができます。未経験者でもプログラミングの基礎知識があれば、経験豊富な先輩エンジニアがしっかりサポートします。

      私たちは「技術で世界を変える」というビジョンのもと、挑戦を恐れない方、常に学び続ける姿勢を持つ方を歓迎します。フレックス制度と週3日までのリモートワークにより、ワークライフバランスも充実。

      あなたのキャリアの次のステップを、私たちと一緒に踏み出しませんか？
    `,
    requirements: [
      "JavaScriptの基本的な知識",
      "プログラミングの基礎知識",
      "新しい技術を学ぶ意欲",
      "チームでの開発に興味がある方",
    ],
    preferredSkills: [
      "Node.js",
      "Express",
      "データベース（MongoDB, MySQL等）",
      "Git",
      "AWS/Azureなどのクラウドサービス",
    ],
    location: "大阪（週3リモート可）",
    employmentType: "full-time",
    experienceLevel: "entry",
    salary: {
      min: 350000,
      max: 600000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-001",
        minimumScore: 60,
      },
    ],
    postedAt: new Date("2023-05-28"),
    updatedAt: new Date("2023-05-28"),
    isActive: true,
    imageUrl: "/jobs/job02.jpg",
  },
  {
    id: "job-003",
    companyId: "company-003",
    title: "データサイエンティスト",
    description: `
      データサイエンスラボでは、AIと機械学習のスキルを活かして実社会の課題を解決するデータサイエンティストを募集しています。

      当社では金融、ヘルスケア、小売など様々な業界のクライアントと協力し、データ駆動型の意思決定を支援するプロジェクトに取り組んでいます。あなたには大規模データセットの分析、予測モデルの開発、クライアントへの分析結果のプレゼンテーションなどを担当していただきます。

      チームは少数精鋭で、一人ひとりが大きな責任と裁量を持ちます。最新の研究成果を取り入れながら、実用的なソリューションを生み出す環境です。産学連携も積極的に行っており、アカデミックな知識を実践に活かす機会も豊富です。

      データの力で社会を変革する旅に、あなたも参加しませんか？
    `,
    requirements: [
      "統計学や機械学習の基礎知識",
      "Python、R、SQLなどのデータ分析言語の経験",
      "データの前処理、可視化、モデリングの経験",
      "複雑な分析結果をわかりやすく説明する能力",
    ],
    preferredSkills: [
      "TensorFlow、PyTorch、scikit-learnなどのライブラリの使用経験",
      "クラウドプラットフォーム（AWS、GCP、Azure）での分析経験",
      "自然言語処理や画像認識プロジェクトの経験",
      "データエンジニアリングのスキル",
    ],
    location: "東京（フルリモート可）",
    employmentType: "full-time",
    experienceLevel: "mid",
    salary: {
      min: 600000,
      max: 900000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-002",
        minimumScore: 75,
      },
    ],
    postedAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
    isActive: true,
    imageUrl: "/jobs/job03.jpg",
  },
  {
    id: "job-004",
    companyId: "company-004",
    title: "モバイルアプリ開発者（iOS/Android）",
    description: `
      モバイルクリエイトでは、革新的なモバイルアプリを開発するエンジニアを募集しています。

      当社では健康・フィットネス、生産性向上、エンターテイメントなど、様々なジャンルのアプリを開発しています。あなたにはiOSまたはAndroid向けの開発を担当いただき、アイデアの段階からリリース、その後の改善まで一貫して携わっていただきます。

      私たちは「ユーザーの日常を豊かにする」という理念のもと、使いやすさとデザイン性を重視したアプリ開発を行っています。スタートアップ気質の環境で、アイデアを素早くプロトタイプ化し、ユーザーフィードバックを取り入れながら改善するアジャイルな開発スタイルです。

      自分のアイデアを形にし、多くのユーザーに届けたいエンジニアの皆さん、ぜひ私たちのチームに加わってください。
    `,
    requirements: [
      "iOS（Swift）またはAndroid（Kotlin/Java）の開発経験",
      "ユーザー視点に立ったインターフェース設計の経験",
      "アプリのリリースとメンテナンスの経験",
      "チームでの開発経験",
    ],
    preferredSkills: [
      "クロスプラットフォーム開発（Flutter, React Native）の経験",
      "バックエンド連携（API統合、認証）の実装経験",
      "アプリのパフォーマンス最適化経験",
      "UI/UXデザインのセンス",
    ],
    location: "東京（週3リモート可）",
    employmentType: "full-time",
    experienceLevel: "mid",
    salary: {
      min: 500000,
      max: 800000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-003",
        minimumScore: 70,
      },
    ],
    postedAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20"),
    isActive: true,
    imageUrl: "/jobs/job04.jpg",
  },
  {
    id: "job-005",
    companyId: "company-005",
    title: "クラウドインフラエンジニア",
    description: `
      クラウドソリューションズでは、企業のクラウド移行と運用を支援するインフラエンジニアを募集しています。

      当社は様々な規模・業界のクライアントのデジタルトランスフォーメーションを支援しており、特にAWS、Azure、GCPなどのクラウドプラットフォームを活用したインフラ構築に強みを持っています。あなたには要件定義からアーキテクチャ設計、実装、運用保守まで幅広く携わっていただきます。

      私たちは「安全で効率的なクラウド環境の実現」をミッションに掲げ、最新技術の研究と実践を両立しています。社内勉強会や資格取得支援も充実しており、技術力向上をバックアップします。地方拠点としての強みを活かしたリモートワークと、定期的なオフサイトミーティングでチームの結束を高めています。

      クラウド技術で企業のビジネスを加速させる、そんなやりがいのある仕事に挑戦してみませんか？
    `,
    requirements: [
      "クラウドプラットフォーム（AWS、Azure、GCPなど）の実務経験",
      "Linuxサーバー管理の知識",
      "ネットワーク・セキュリティの基礎知識",
      "コマンドラインツールの使用経験",
    ],
    preferredSkills: [
      "IaC（Terraform、CloudFormation）の経験",
      "コンテナ技術（Docker, Kubernetes）の経験",
      "CI/CDパイプラインの構築経験",
      "クラウド関連の認定資格",
    ],
    location: "福岡（フルリモート可）",
    employmentType: "full-time",
    experienceLevel: "senior",
    salary: {
      min: 600000,
      max: 1000000,
      currency: "JPY",
    },
    requiredQuizzes: [
      {
        quizId: "quiz-004",
        minimumScore: 80,
      },
    ],
    postedAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-05-10"),
    isActive: true,
    imageUrl: "/jobs/job05.jpg",
  },
];
