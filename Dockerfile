FROM node:14.5.0-alpine

# ワークディレクトリ
WORKDIR /app

# コンテナ内で必要なパッケージをインストール
COPY package.json .
RUN npm install

# ホスト側カレントディレクトリ内部をコンテナ側にコピー
COPY . .

# 起動
CMD npm start  


