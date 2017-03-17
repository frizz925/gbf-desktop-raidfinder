import { ipcMain } from "electron";
import TweetStream from "~/lib/TweetStream";

const stream = new TweetStream();
let sender;

ipcMain.on("init", (evt) => {
  sender = evt.sender;
});

ipcMain.on("storage-get", (evt, key) => {
  // TODO: implement electron-json-storage
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