import React from "react";
import { List } from "office-ui-fabric-react/lib/List";
import TweetTile from "~/ui/components/TweetTile";

export default (items) => (
    <div>
        <div className="MailList" data-is-scrollable={ true }>
            <List
                items={items}
                onRenderCell={ (item, idx) => (
                    <TweetTile key={item.tweet.idx} item={item} />
                ) }
            />
        </div>
    </div>
);