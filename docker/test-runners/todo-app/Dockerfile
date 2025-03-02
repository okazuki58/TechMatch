FROM node:18-slim

# Puppeteerの依存関係インストール
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# テストに必要なパッケージをインストール
COPY package.json .
RUN npm install

# テスト実行スクリプトをコピー
COPY test-runner.js .

# 環境変数の設定
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# コンテナ起動時にテストを実行
CMD ["node", "test-runner.js"]