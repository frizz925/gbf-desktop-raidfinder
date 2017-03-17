
export default class TweetParser {
  parse(tweet) {
    return {
      raid: {
        code: tweet.text.match(/(参戦ID：|Battle ID: )([A-Z0-9]+)\n/)[2]
      },
      tweet
    }
  }
}