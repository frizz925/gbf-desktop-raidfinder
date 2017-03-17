import { ipcMain } from "electron";
import TweetStream from "~/lib/TweetStream";
import storage from "electron-json-storage";
import OAuthFactory from "~/lib/Twitter/Auth/OAuthFactory";

let sender;
let stream;
let consumerKeys = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET
};
let factory = new OAuthFactory(consumerKeys);

ipcMain.on("init", (evt) => {
  // do not re-initialize stream
  if (stream) return;

  storage.get("access_tokens", (err, tokens) => {
    stream = new TweetStream(consumerKeys, tokens);
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
  factory.accessTokenFromPIN(requestToken, pin).then((tokens) => {
    evt.sender.send("access-token-set-pin", tokens);
  }, (err) => {
    console.error(err);
  });
});

module.exports = function() {
  // do nothing
};