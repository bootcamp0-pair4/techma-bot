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
];
const chatComments = [
  "一円玉って、作るのに三円かかるらしいよ！",
  "ユーロ、リラ、\nポンド、ルーブル、\nドル、クローネ…",
  "ハンガリーではポテトチップス税っていうのがあるんだって！…でも「税」ってなんだろ？",
];
exports.handler = (event) => {
  console.log(event);

  const replyToken = JSON.parse(event.body).events[0].replyToken;

  let reqMessage = JSON.parse(event.body).events[0].message.text;
  let resMessage = "";
  let reqStampChecker = JSON.parse(event.body).events[0].message.type;

  if (reqStampChecker === "sticker") {
    return client.replyMessage(replyToken, {
      type: "sticker",
      packageId: 8515,
      stickerId: 16581253, //ハート
    });
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
  } else if (reqMessage.indexOf("振込") != -1) {
    let transferAmountArray = reqMessage.split("円");
    console.log("[transferAmountArray]", transferAmountArray);
    const transferAmount = parseInt(transferAmountArray[0]);
    console.log("[transferAmountArray]", transferAmount);
    console.log("[TYOEOF]", typeof transferAmount);

    var getOptions = {
      method: "GET",
      url: "https://api.sunabar.gmo-aozora.com/personal/v1/accounts/balances",
      headers: {
        Accept: "application/json;charset=UTF-8",
        "Content-Type": "application/json;charset=UTF-8",
        "x-access-token": sunabarToken,
      },
    };

    request(getOptions, function (error, response) {
      if (error) throw new Error(error);

      console.log("[GET res.body]", response.body);
      const data = JSON.parse(response.body);
      const balance = parseInt(data.balances[0].balance);

      if (balance > transferAmount) {
        var postgetOptions = {
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
            totalAmount: transferAmount,
            transfers: [
              // {
              //   itemId: 1,
              //   transferAmount: transferAmount,
              //   beneficiaryBankCode: "0310",
              //   beneficiaryBranchCode: "101",
              //   accountTypeCode: "1",
              //   accountNumber: "0000017",
              //   beneficiaryName: "ｽﾅﾊﾞ ﾂﾈｵ",
              // },
              {
                itemId: "1",
                transferAmount: transferAmount,
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

        request(postgetOptions, function (error, response) {
          if (error) throw new Error(error);
          console.log("[POST res.body]", response.body);

          resMessage =
            "振込を受け付けました。\n受付番号:" + response.body.applyNo;
          return client.replyMessage(replyToken, {
            type: "text",
            text: resMessage,
          });
        });
      } else {
        resMessage =
          transferAmount.toLocaleString() +
          "円振り込もうとしましたが、残高不足のため振り込めません" +
          "\n" +
          "残高は" +
          balance.toLocaleString() +
          "円です";

        return client.replyMessage(replyToken, {
          type: "text",
          text: resMessage,
        });
      }
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
  }
};
