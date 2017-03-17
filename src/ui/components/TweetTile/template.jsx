import React from "react";

export default (item) => (
    <div className="ms-ListItem is-unread">
        <span className="ms-ListItem-primaryText">{ item.raid.code }</span>
        <span className="ms-ListItem-secondaryText">{ item.tweet.user.screen_name }</span>
        <span className="ms-ListItem-tertiaryText">{ item.tweet.text }</span>
        <span className="ms-ListItem-metaText">{ item.tweet.created_at }</span>
    </div>
);