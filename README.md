# gbf-desktop-raidfinder

### Check the [releases](https://github.com/Frizz925/gbf-desktop-raidfinder/releases) page for download!


This is a multi-platform desktop application inspired by [walfie](https://github.com/walfie) [gbf-raidfinder](https://github.com/walfie/gbf-raidfinder). This application uses the same [Twitter](https://twitter.com) [Streaming API](https://dev.twitter.com/streaming/overview) as gbf-raidfinder and thus provides the similar real-time update capability to find [Granblue Fantasy](http://granbluefantasy.jp/) raid tweets.

One of the main goals of this application is to alleviate the problem with gbf-raidfinder frequent downtime due to high load.

## Differences with gbf-raidfinder
### The good
* Multi-platform desktop application with web technologies using [Electron](https://electron.atom.io/).
* [Two-tier architecture](http://www.softwaretestingclass.com/what-is-difference-between-two-tier-and-three-tier-architecture/); the application interacts directly with Twitter APIs compared to gbf-raidfinder's three-tier architecture. This makes the application as fast if not faster than gbf-raidfinder since this eliminates the need of the intermediate server. No intermediate server means no downtime and faster initial load of the application. Use it anytime you want without worry!
### The bad
* As of v1.0.0 you can only use one window to follow the boss raids. Multi-window and/or multi-tab features will be implemented in the future.
* Boss raids dictionary is not updated regulary. This dictionary is used to find specific raids from tweets. Custom dictionary feature will be implemented in the future.
* Twitter login required.

## Setup
### DISCLAIMER: You first need to have consumer tokens of your Twitter application. You can register your application [here](https://apps.twitter.com/) to get the consumer tokens. The following commands also assume that you are using a terminal with *bash* or similar shell.

You need the following programs in order to start developing or building the project.
* Git
* [Node.js](https://nodejs.org/)

Clone the project repository using git and navigate into it. Install the dependencies first and copy the *.env.example* file and name it *.env*.
```
# git clone https://github.com/Frizz925/gbf-desktop-raidfinder
# cd gbf-desktop-raidfinder
# npm install
# cp .env.example .env
```
Grab your *consumer key* and *consumer secret* from your Twitter application page and enter them into the *.env* file.
```
CONSUMER_KEY=<your consumer key>
CONSUMER_SECRET=<your consumer secret>
```

## Development
Build tasks are done using [Gulp](https://gulpjs.com/) and NPM scripts. The build tasks have two modes: development and production.

Make sure you have Gulp CLI installed.
```
$ npm install -g gulp
```
Developing the application itself uses a combination of Gulp, [Babel](https://babeljs.io/), [Webpack](https://webpack.js.org/), [Sass](http://sass-lang.com/), [BrowserSync](https://browsersync.io/), and Electron. You can use the following commands to get started.
```
# gulp
# gulp serve
```
The *gulp* command itself will run all build tasks first. This includes running the Babel transpiler, Webpack bundler, and compiling Sass files into CSS. The output of the build tasks can be found in the *dist/* directory.

The *gulp serve* command will watch for any file changes and reload your Electron window automatically via BrowserSync. The *gulp serve* command will *NOT* exits the program immediately after it finishes since it's required to keep the BrowserSync server running.

Finally, open another terminal to run this last command.
```
# npm run electron
``` 
The last command will open your Electron application and renders the page from BrowserSync server.

Remember that **NOT** all file changes will automatically reload your Electron application to reflect the latest changes. Scripts that run on [main process](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md) (eg. index.js) require you to manually restart your Electron application. The scripts that run on the web pages (eg. dist/bundle.js), however, will be automatically updated by BrowserSync.

## Building
Simply run the following commands in the root directory of the project.
```
# npm install
# npm run build
```
The script will run all build tasks in production mode and packages the Electron application into the *build/* directory using [electron-packager](https://github.com/electron-userland/electron-packager).

## Bug Reporting and Suggestions
Head over to the [issues](https://github.com/Frizz925/gbf-desktop-raidfinder/issues) page for any bug reports or feature requests.
