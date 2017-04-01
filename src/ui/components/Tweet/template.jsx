import React from "react";
import { ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";

export default function (item) {
  return (
    <div className={(item.raid.read) ? "tweet-read" : ""}>
      <ListItem onClick={::this.copyCode} style={{cursor: "pointer"}}>
        <div className="row">
          <div className="col-xs-12 clearfix">
            <div className="pull-left">
              {item.tweet.user.screen_name}
              &nbsp;
              <span className="text-size-xs">
                {item.raid.language == "en" ? "(" + item.raid.language.toUpperCase() + ")" : ""}
              </span>
              &nbsp;
              <span className="text-color-dark50 text-size-sm">
                {this.relativeTime(item.tweet.created_at)}
              </span>
            </div> {/* .pull-left */}
            <div className="pull-right text-weight-bold">
              {item.raid.code}
            </div> {/* .pull-right */}
          </div> {/* .col */}
        </div> {/* .row */}
        <div className="row">
          <div className="col-xs-12 text-color-dark50 text-size-sm">
            {item.raid.messages[0]}
          </div> {/* .col */}
        </div> {/* .row */}
      </ListItem>
      <Divider />
    </div>
  );
}