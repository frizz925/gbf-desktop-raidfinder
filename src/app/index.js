import { ipcMain } from "electron";
import storage from "electron-json-storage";
import TweetStream from "~/lib/Twitter/Tweet/TweetStream";
import OAuthFactory from "~/lib/Twitter/Auth/OAuthFactory";
import Twitter from "twitter";

let sender;
let stream;
let twitter;
let consumerKeys = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET
};
let factory = new OAuthFactory(consumerKeys);

ipcMain.on("init", (evt) => {
  sender = evt.sender;

  // do not re-initialize stream
  if (stream) return;

  console.log("Main process", "init");

  storage.get("access_tokens", (err, tokens) => {
    if (err) {
      throw err;
    }

    twitter = new Twitter({
      consumer_key: consumerKeys.consumer_key,
      consumer_secret: consumerKeys.consumer_secret,
      access_token_key: tokens.oauth_token,
      access_token_secret: tokens.oauth_token_secret
    });

    stream = new TweetStream(twitter);
    stream.getTweets().subscribe((payload) => {
      if (!sender) return;
      if (payload.type === "error") {
        sender.send("error", payload);
      } else {
        sender.send("new-tweet", payload);
      }
    });
  });
});

ipcMain.on("storage-get", (evt, key) => {
  storage.get(key, (err, value) => {
    if (err) {
      throw err;
    }
    evt.sender.send("storage-get", key, value);
  });
});

ipcMain.on("storage-has", (evt, key) => {
  storage.has(key, (err, hasKey) => {
    if (err) {
      throw err;
    }
    evt.sender.send("storage-has", key, hasKey);
  });
});

ipcMain.on("storage-set", (evt, key, value) => {
  console.log("Main process", "storage-set", key, value);
  storage.set(key, value, (err) => {
    if (err) {
      throw err;
    }
    evt.sender.send("storage-set", key);
  });
});

ipcMain.on("request-token-get", (evt) => {
  factory.requestToken().then((oauthToken) => {
    evt.sender.send("request-token-get", oauthToken);
  }, (err) => {
    console.error(err);
  });
});

ipcMain.on("access-token-set-pin", (evt, requestToken, pin) => {
  console.log("Main process", requestToken, pin);
  factory.accessTokenFromPIN(requestToken, pin).then((tokens) => {
    console.log("Main process", tokens);
    evt.sender.send("access-token-set-pin", tokens);
  }, (err) => {
    console.error(err);
  });
});

ipcMain.on("twitter-api-get", (evt, url, params, action) => {
  if (!twitter) {
    throw new Error("Twitter client not initialized yet!");
  }

  twitter.get(url, params, (err, result) => {
    if (err) {
      throw err;
    }
    evt.sender.send("twitter-api", { url, params, result, action });
  });
});

module.exports = function () {
  // do nothing
};