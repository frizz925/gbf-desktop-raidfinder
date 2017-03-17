import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "~/ui/components/App";
import TweetStream from "~/ui/lib/TweetStream";
import Rx from "rxjs/Rx";

let root = document.getElementById("app");
let storage = Rx.create((observer) => {
    window.ipc.on("storage-get", (event, key, value) => {
        observer.next({key, value});
    });
});

storage
    .filter((payload) => payload.key === "access_tokens")
    .map((payload) => payload.value)
    .subscribe((value) => {
        if (value) {
            ReactDOM.render(<App stream={ new TweetStream() }/>, root);
            window.ipc.send("init");
        } else {
            // TODO: open auth page
        }
    });

window.ipc.send("storage-get", "access_tokens");

