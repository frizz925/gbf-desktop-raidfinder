import Rx from "rxjs/Rx";
import TweetChecker from "~/lib/Twitter/Tweet/TweetChecker";
const ipc = window.ipc;

export default class TweetStream {
  constructor() {
    this.checker = new TweetChecker();
  }

  getTweets() {
    return Rx.Observable.create((observer) => {

      ipc.on("new-tweet", (evt, payload) => {
        var tweet = payload.tweet;
        if (this.checkRaidTweet(tweet)) {
          observer.next(tweet);
        }
      });

      ipc.on("error", (evt, payload) => {
        console.error(payload);
      });

    });
  }

  checkRaidTweet(tweet) {
    return this.checker.check(tweet);
  }
}