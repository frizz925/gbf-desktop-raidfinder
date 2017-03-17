import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "~/ui/components/App";
import Auth from "~/ui/components/Auth";
import TweetStream from "~/ui/lib/Twitter/TweetStream";
import Rx from "rxjs/Rx";

let root = document.getElementById("app");
let storage = Rx.Observable.create((observer) => {
    window.ipc.on("storage-has", (evt, key, hasKey) => {
        observer.next({key, hasKey});
    });
});
let token = Rx.Observable.create((observer) => {
    window.ipc.on("request-token", (evt, oauthToken) => {
        observer.next(oauthToken);
    });
});

storage
    .filter((payload) => payload.key === "access_tokens")
    .map((payload) => payload.hasKey)
    .subscribe((hasKey) => {
        if (hasKey) {
            ReactDOM.render(<App stream={ new TweetStream() }/>, root);
            window.ipc.send("init");
        } else {
            ReactDOM.render(<Auth token={token} />, root);
            window.ipc.send("request-token");
        }
    });

window.ipc.send("storage-has", "access_tokens");

