import Rx from "rxjs/Rx";
import TweetChecker from "~/lib/Twitter/Tweet/TweetChecker";
import TweetParser from "~/lib/Twitter/Tweet/TweetParser";
const ipc = window.ipc;

export default class TweetStream {
  constructor() {
    this.checker = new TweetChecker();
    this.parser = new TweetParser();
  }

  getTweets() {
    return Rx.Observable.create((observer) => {

      ipc.on("new-tweet", (evt, payload) => {
        var tweet = payload.tweet;
        if (this.checkRaidTweet(tweet)) {
          tweet = this.parseTweet(tweet);
          if (tweet) {
            observer.next(tweet);
          }
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

  parseTweet(tweet) {
    return this.parser.parse(tweet);
  }
}