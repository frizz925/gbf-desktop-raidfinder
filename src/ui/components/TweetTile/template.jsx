import React from "react";

export default function (item) {
  return (
    <div className="ms-ListItem is-unread" onClick={this.copyCode(item)} style={{cursor: "pointer"}}>
      <span className="ms-ListItem-primaryText">{item.raid.code}</span>
      <span className="ms-ListItem-secondaryText">{item.tweet.user.screen_name}</span>
      <span className="ms-ListItem-tertiaryText">{item.tweet.text}</span>
      <span className="ms-ListItem-metaText">{this.relativeTime(item.tweet.created_at)}</span>
    </div>
  );
}