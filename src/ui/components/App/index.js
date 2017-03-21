import { Component } from "react";
import template from "./template.jsx";
import BossDictionary from "~/lib/Twitter/Tweet/BossDictionary.json";
import each from "lodash/each";
import map from "lodash/map";
import assign from "lodash/assign";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [],
      filter: false,
      snackbar: {
        message: "",
        open: false
      },
      dialog: {
        open: false
      }
    };
    this.preferences = {};
    this.dictionary = BossDictionary.sort(::this.sortDictionary);
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
  }

  subscribeToPreferences() {
    this.props.storage.observables.get("preferences")
      .subscribe((payload) => {
        this.preferences = payload.value;
        this.updateState({
          filter: this.preferences.filter
        });
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
        filter: item,
        dialog: assign(this.state.dialog, {
          open: false
        }),
        tweets: []
      });

      this.props.storage.set("preferences", assign(this.preferences, {
        filter: item
      }));
    };
  }

  updateState(newState) {
    var state = assign({}, this.state, newState);
    this.setState(state);
  }

  savePreferences(preferences) {
    window.ipc.send("preferences-save", preferences);
  }

  render() {
    return template.call(this);
  }
}