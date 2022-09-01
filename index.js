"use strict";

const line = require("@line/bot-sdk");
var request = require("request");

const config = {
  channelSecret: process.env.channelSecretLINE,
  channelAccessToken: process.env.channelAccessTokenLINE,
};

const client = new line.Client(config);
const sunabarToken = process.env.sunabarToken;

const stampList = [
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979904, //OK
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979908, //ぬくぬく
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979909, //もしもし
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979910, //ふぅ
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979911, //やくそく
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979912, //ありがと
  },
  {
    type: "sticker",
    packageId: 6325,
    stickerId: 10979914, //おつかれ
  },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581260, //おはよう
  //   },
  {
    type: "sticker",
    packageId: 8515,
    stickerId: 16581242, //OKでーす
  },
  {
    type: "sticker",
    packageId: 8515,
    stickerId: 16581243, //ありがとうございます
  },
  {
    type: "sticker",
    packageId: 8515,
    stickerId: 16581253, //ハート
  },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581261, //おやすみなさい
  //   },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581254, //さすがです
  //   },
  //   {
  //     type: "sticker",
  //     packageId: 8515,
  //     stickerId: 16581258, //うーん
  //   },
  {
    type: "sticker",
    packageId: 11538,
    stickerId: 51626518, //くま
  },
  {
    type: "sticker",
    packageId: 11538,
    stickerId: 51626503, //くま
  },
];
const chatComments = [
  "一円玉って、作るのに三円かかるらしいよ！",
  "ユーロ、リラ、\nポンド、ルーブル、\nドル、クローネ…",
  "ハンガリーではポテトチップス税っていうのがあるんだって！\n…でも「税」ってなんだろ？",
  "『日本銀行券』ってなーんだ！\n正解は「おさつ」でした！難しい呼び方があるんだね〜",
  "世界で一番大きなお金は直径3.6メートルなんだって！\n小さい自動車と同じくらいの大きさなんだって",
];
const getRandomElem = (array) => {
  let index = Math.floor(Math.random() * array.length);
  return array[index];
};

exports.handler = (event) => {
  console.log(event);

  if (event.body === undefined) {
    let reminder = event.resources[0];
    console.log("[remainder]", reminder);
    console.log("[USER_ID]", env.USER_ID);

    if (reminder == process.env.remindToken1) {
      return client.pushMessage(process.env.USER_ID, {
        type: "text",
        text: "ねえ、ランドセル用意した？",
      });
    }
    if (reminder == process.env.remindToken2) {
      return client.pushMessage(process.env.USER_ID, {
        type: "text",
        text: "おはよう！熱を測って、そしたら朝ごはん♪",
      });
    }
  } else {
    const replyToken = JSON.parse(event.body).events[0].replyToken;

    let reqMessage = JSON.parse(event.body).events[0].message.text;
    let resMessage = "";
    let reqStampChecker = JSON.parse(event.body).events[0].message.type;

    if (reqStampChecker === "sticker") {
      return client.replyMessage(replyToken, getRandomElem(stampList));
    }
    if (reqMessage == "おはよう") {
      return client.replyMessage(replyToken, {
        type: "sticker",
        packageId: 8515,
        stickerId: 16581260, //おはよう
      });
    }
    if (reqMessage == "おやすみ") {
      return client.replyMessage(replyToken, {
        type: "sticker",
        packageId: 8515,
        stickerId: 16581261, //おやすみなさい
      });
    }
    if (reqMessage == "教えて") {
      return client.replyMessage(replyToken, {
        type: "text",
        text: getRandomElem(chatComments),
      });
    } else if (reqMessage == "自分のお金") {
      var options = {
        method: "GET",
        url: "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-token": sunabarToken,
        },
      };

      request(options, function (error, response) {
        if (error) throw new Error(error);

        let value = JSON.parse(response.body).balances[0].balance;
        value = Number(value).toLocaleString();
        resMessage = `銀行の中に持っているお金のことを残高というんだよ！\nきみの残高は${value}円！`;

        return client.replyMessage(replyToken, {
          type: "text",
          text: resMessage,
        });
      });
    } else if (reqMessage == "残高") {
      var options = {
        method: "GET",
        url: "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-token": sunabarToken,
        },
      };

      request(options, function (error, response) {
        if (error) throw new Error(error);

        let value = JSON.parse(response.body).balances[0].balance;
        value = Number(value).toLocaleString();
        resMessage = `きみの残高は${value}円！`;

        return client.replyMessage(replyToken, {
          type: "text",
          text: resMessage,
        });
      });
    } else if (reqMessage == "貯金どう？") {
      var options = {
        method: "GET",
        url: "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-token": sunabarToken,
        },
      };

      request(options, function (error, response) {
        if (error) throw new Error(error);

        let savings = JSON.parse(response.body).spAccountBalances[1].odBalance;
        if (50000 < savings) {
          return client.replyMessage(replyToken, {
            type: "sticker",
            packageId: 8515,
            stickerId: 16581254, //さすがです
          });
        } else {
          return client.replyMessage(replyToken, {
            type: "sticker",
            packageId: 8515,
            stickerId: 16581258, //うーん
          });
        }
      });
    } else if (reqMessage == "塾の月謝") {
      var options = {
        method: "POST",
        url: "https://api.sunabar.gmo-aozora.com/personal/v1/transfer/request",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json",
          "x-access-token": sunabarToken,
        },
        body: {
          accountId: "302010005067",
          transferDesignatedDate: "2022-09-05",
          transferDateHolidayCode: "1",
          totalCount: "1",
          totalAmount: "1500",
          transfers: [
            {
              itemId: "1",
              transferAmount: "1500",
              beneficiaryBankCode: "0310",
              beneficiaryBranchCode: "101",
              accountTypeCode: "1",
              accountNumber: "0005067",
              beneficiaryName: "ｽﾅﾊﾞﾌﾞﾝｲﾁ(ｶ",
            },
          ],
        },
        json: true,
      };

      request(options, function (error, response) {
        if (error) throw new Error(error);

        let number = response.body.applyNo;

        resMessage = `先生にお支払いしたよ！\nママに確認してって伝えてね（https://bank.sunabar.gmo-aozora.com/bank/notices/important）\n受付番号は${number}です`;

        return client.replyMessage(replyToken, {
          type: "text",
          text: resMessage,
        });
      });
    } else if (reqMessage == "おこづかい") {
      var options = {
        method: "POST",
        url: "https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-token": sunabarToken,
        },
        body: {
          depositSpAccountId: "SP50220278973",
          debitSpAccountId: "SP30210005067",
          currencyCode: "JPY",
          paymentAmount: "500",
        },
        json: true,
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);

        resMessage = "おこづかいを残高から分けたよ！";

        var options = {
          method: "GET",
          url: "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances",
          headers: {
            Accept: "application/json;charset=UTF-8",
            "Content-Type": "application/json;charset=UTF-8",
            "x-access-token": sunabarToken,
          },
        };

        request(options, function (error, response) {
          if (error) throw new Error(error);

          console.log(response.body);
          const data = JSON.parse(response.body);
          const mainBalance = parseInt(data.spAccountBalances[0].odBalance);
          const monthlyBalance = parseInt(data.spAccountBalances[1].odBalance);

          resMessage = `${resMessage}\n残高は${mainBalance.toLocaleString()}円になって、\nおこづかい残高は${monthlyBalance.toLocaleString()}円になったよ！`;

          return client.replyMessage(replyToken, {
            type: "text",
            text: resMessage,
          });
        });
      });
    } else if (reqMessage == "貯金") {
      var options = {
        method: "POST",
        url: "https://api.sunabar.gmo-aozora.com/personal/v1/transfer/spaccounts-transfer",
        headers: {
          Accept: "application/json;charset=UTF-8",
          "Content-Type": "application/json;charset=UTF-8",
          "x-access-token": sunabarToken,
        },
        body: {
          depositSpAccountId: "SP50220278973",
          debitSpAccountId: "SP50220285223",
          currencyCode: "JPY",
          paymentAmount: "10",
        },
        json: true,
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);

        resMessage = "お金を貯めることができてえらいね！";

        var options = {
          method: "GET",
          url: "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances",
          headers: {
            Accept: "application/json;charset=UTF-8",
            "Content-Type": "application/json;charset=UTF-8",
            "x-access-token": sunabarToken,
          },
        };

        request(options, function (error, response) {
          if (error) throw new Error(error);

          console.log(response.body);
          const data = JSON.parse(response.body);
          const mainBalance = parseInt(data.spAccountBalances[0].odBalance);
          const savingBalance = parseInt(data.spAccountBalances[1].odBalance);

          resMessage = `${resMessage}\nおこづかいは${mainBalance.toLocaleString()}円になったけど、\n貯金は${savingBalance.toLocaleString()}円になったよ！`;

          return client.replyMessage(replyToken, {
            type: "text",
            text: resMessage,
          });
        });
      });
    } else if (
      reqMessage.includes("円") &&
      !reqMessage.includes("振込") &&
      1 < reqMessage.length
    ) {
      let amountArray = reqMessage.split("円");
      // console.log("[amountArray]", amountArray);
      const amount = parseInt(amountArray[0]);
      // console.log("[amount]", amount);
      if (0 < amount && amount < 500) {
        resMessage = "ちりも積もれば山となる…小さい金額でも大事なお金だよ";
      } else if (amount == 500) {
        resMessage =
          "きみの一ヶ月のおこづかいと同じ金額だね。30日で割ったらおよそ16円！";
      } else if (500 < amount && amount <= 1500) {
        resMessage =
          "東京のマクドナルドで１時間働いたお給料が1,000円くらいなんだって〜";
      } else if (1500 < amount && amount <= 5000) {
        resMessage = "スプラトゥーンは6,500円…もう少し貯金しないと…";
      } else if (5000 < amount && amount < 20000) {
        resMessage =
          "人間の大人が一日働いてもらえるお給料がおよそ１万円くらいなんだって。ほんとかな〜？";
      } else {
        resMessage = "むずかしいお話だね〜";
      }
      return client.replyMessage(replyToken, {
        type: "text",
        text: resMessage,
      });
    } else {
      return client.replyMessage(replyToken, {
        type: "text",
        text: "残高？振込？",
      });
    }
  }
};
