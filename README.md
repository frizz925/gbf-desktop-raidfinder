# gbf-desktop-raidfinder

## This application is still in **development**!

This is a multi-platform desktop application inspired by [walfie](https://github.com/walfie) [gbf-raidfinder](https://github.com/walfie/gbf-raidfinder). This application uses the same [Twitter](https://twitter.com) [Streaming API](https://dev.twitter.com/streaming/overview) as gbf-raidfinder and thus provides the similar real-time update capability to find [Granblue Fantasy](http://granbluefantasy.jp/) raid tweets.

One of the main goals of this application is to alleviate the problem with gbf-raidfinder frequent downtime due to high load.

## Differences with gbf-raidfinder
* Multi-platform desktop application with web technologies using [Electron](https://electron.atom.io/).
* [Two-tier architecture](http://www.softwaretestingclass.com/what-is-difference-between-two-tier-and-three-tier-architecture/); the application interacts directly with Twitter APIs compared to gbf-raidfinder's three-tier architecture.
* Twitter login required.

*This readme is still a WIP*