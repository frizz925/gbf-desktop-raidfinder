import each from "lodash/each";

const keywords = {
  jp: "参加者募集！参戦ID：",
  en: "I need backup!Battle ID: "
};

export default class TweetParser {
  parse(tweet) {
    var text = tweet.text;
    var raid;
    each(keywords, (keyword, language) => {
      var idx = text.lastIndexOf(keyword);
      if (idx >= 0) {
        var sub = text.substring(idx);
        var regexp = new RegExp(keyword + "([A-Z0-9]+)");
        raid = {
          code: sub.match(regexp)[1],
          message: text.substring(0, idx),
          language
        };
      }
    });

    if (!raid) return null;
    return { raid, tweet };
  }
}