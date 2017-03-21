import { Component } from "react";
import template from "./template.jsx";
import moment from "moment";

export default class Tweet extends Component {
  copyCode() {
    var item = this.props.item;
    window.clipboard.writeText(item.raid.code);
    this.props.snackbarMessage(item.raid.code + " copied to clipboard");
  }

  relativeTime(time) {
    var now = moment().unix();
    var format = "ddd MMM DD HH:mm:ss ZZ YYYY";
    var relative = now - moment(time, format).unix();
    if (relative < 60) {
      return "now";
    } else if (relative < 3600) {
      return Math.round(relative / 60) + "m";
    } else if (relative < 3600 * 24) {
      return Math.round(relative / 3600) + "h";
    } else {
      return Math.round(relative / 3600 / 24) + "d";
    }
  }

  render() {
    return template.call(this, this.props.item);
  }
}