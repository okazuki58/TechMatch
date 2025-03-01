FROM node:18-slim

# Puppeteerの依存関係をインストール
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libxtst6 \
    libxshmfence1 \
    libgbm1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを作成
WORKDIR /app

# 依存パッケージをコピーしてインストール
COPY package.json package-lock.json ./
RUN npm ci

# テスト実行スクリプトをコピー
COPY test-runner.js ./

# 低権限ユーザーを作成
RUN groupadd -r testuser && useradd -r -g testuser testuser
USER testuser

# コンテナ起動時のコマンド
ENTRYPOINT ["node", "test-runner.js"]