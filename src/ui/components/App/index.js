import { Component } from "react";
import template from "./template.jsx";
import BossDictionary from "~/lib/Twitter/Tweet/BossDictionary.json";
import TweetParser from "~/lib/Twitter/Tweet/TweetParser";
import each from "lodash/each";
import map from "lodash/map";
import assign from "lodash/assign";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [],
      filter: null,
      snackbar: {
        message: "",
        open: false
      },
      dialog: {
        open: false,
        search: ""
      }
    };
    this.preferences = {};
    this.dictionary = BossDictionary.sort(::this.sortDictionary);
    this.parser = new TweetParser();
    this.subscribeToTweets();
    this.subscribeToPreferences();
  }

  sortDictionary(a, b) {
    var regexp = /^Lv(\d+)/;
    var levelA = a.jp.match(regexp);
    var levelB = b.jp.match(regexp);
    if (levelA && levelB) {
      var diff = parseInt(levelA[1]) - parseInt(levelB[1]);
      if (diff != 0) return diff;
    }
    return a.jp.localeCompare(b.jp);
  }

  subscribeToTweets() {
    this.props.stream.getTweets()
      .filter((tweet) => {
        var filter = this.state.filter;
        if (!filter) return false;
        var regex = new RegExp("(" + filter.jp + "|" + filter.en + ")");
        var match = tweet.raid.messages[1].match(regex);
        return match;
      })
      .subscribe(::this.onTweet);

    this.props.twitter
      .filter(({ url, action }) => {
        return url === "search/tweets" &&
          action === "search-raid-tweets";
      })
      .subscribe(({ result }) => {
        this.updateState({
          tweets: map(result.statuses, (tweet) => this.parser.parse(tweet))
        });
      });
  }

  subscribeToPreferences() {
    this.props.storage.observables.get("preferences")
      .subscribe((payload) => {
        this.preferences = payload.value;
        this.updateFilter(this.preferences.filter);
      });
    this.props.storage.get("preferences");
  }

  onTweet(tweet) {
    this.updateState({
      tweets: [tweet].concat(this.state.tweets).slice(0, 50)
    });
  }

  changeSnackbarState(state) {
    return () => {
      this.updateState({
        snackbar: assign(this.state.snackbar, {
          open: state
        })
      });
    };
  }

  snackbarMessage(message) {
    this.updateState({
      snackbar: assign(this.state.snackbar, {
        open: true,
        message
      })
    });
  }

  changeDialogState(state) {
    return () => {
      this.updateState({
        dialog: assign(this.state.dialog, {
          open: state
        })
      });
    };
  }

  changeFilter(item) {
    return () => {
      this.updateState({
        dialog: assign(this.state.dialog, {
          open: false
        }),
      });

      this.updateFilter(item);

      this.props.storage.set("preferences", assign(this.preferences, {
        filter: item
      }));
    };
  }

  changeDialogSearch(evt, search) {
    this.updateState({
      dialog: assign(this.state.dialog, {
        search
      })
    });
  }

  updateState(newState) {
    var state = assign({}, this.state, newState);
    this.setState(state);
  }

  updateFilter(filter) {
    let dialog = assign({}, this.state.dialog, {
      search: ""
    });

    if (!filter) {
      dialog.open = true;
    }

    this.updateState({
      filter, dialog,
      tweets: []
    });

    /*
    // need to find a better and reliable method to pre-fetch the tweets
    window.ipc.send("twitter-api-get", "search/tweets", {
      q: filter.en + " OR " + filter.jp,
      count: 50
    }, "search-raid-tweets");
    */
  }

  savePreferences(preferences) {
    window.ipc.send("preferences-save", preferences);
  }

  render() {
    return template.call(this);
  }
}