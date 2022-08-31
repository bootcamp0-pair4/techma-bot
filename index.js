// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート

// パラメータ設定
const line_config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
  channelSecret: process.env.LINE_CHANNEL_SECRET, // 環境変数からChannel Secretをセットしています
};

// Webサーバー設定
server.listen(process.env.PORT || 1212);

// ルーター設定
// https://[アプリ名].herokuapp.com/bot/webhookでアクセスすると実行する関数
server.post("/bot/webhook", line.middleware(line_config), (req, res, next) => {
  res.sendStatus(200);
  console.log(req.body);
});

exports.handler = (event) => {
  console.log(event);
  const replyToken = JSON.parse(event.body).events[0].replyToken;

  let reqMessage = JSON.parse(event.body).events[0].message.text;
  let resMessage = "";

  if (reqMessage == "おはよう") {
    resMessage = "ゆっくり寝れました？";

    return client.replyMessage(replyToken, {
      type: "text",
      text: resMessage,
    });
  }
};
