import { ipcMain } from "electron";
import TweetStream from "~/lib/TweetStream";
import storage from "electron-json-storage";
import RequestTokenFactory from "~/lib/Twitter/Auth/RequestTokenFactory";

const stream = new TweetStream();
let sender;
let consumerKeys = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET
};
let factory = new RequestTokenFactory(consumerKeys);

ipcMain.on("init", (evt) => {
  sender = evt.sender;
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

ipcMain.on("request-token", (evt) => {
  factory.requestToken().then((oauthToken) => {
    evt.sender.send("request-token", oauthToken);
  }, (err) => {
      console.error(err);
  });
});

module.exports = function() {
  stream.getTweets().subscribe((payload) => {
    if (!sender) return;
    if (payload.type === "error") {
      sender.send("error", payload);
    } else {
      sender.send("new-tweet", payload);
    }
  });
}