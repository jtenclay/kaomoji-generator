# Kaomoji Generator

Final project for General Assembly's Web Development Immersive Bootcamp.

A novelty app for people to make kaomoji (stickers made with text, like (•‿•) ) and share them with friends.

## User Stories

* After downloading the app, the user can create and edit faces, save them to a library, and take screenshots
* The user can change text color, shadow properties, and background pattern/color
* There is a "random" function (not actually random, since random colors tend to look bizarre together) to produce new kaomoji

## Technologies

* Ionic, Cordova, Xcode
* HTML/CSS (SCSS)

## In the Future

* Better stock ("random") kaomoji, possibly pulled from another source
* Background animations
* Faster load; icon & splash screen
* Share directly from app rather than through screenshot utility
* Pre-populate for first-time open to avoid the error message

## Try It Out!

Clone this repository and run:

```bash
$ npm install
$ ionic serve
```

If prompted to update the Ionic CLI, type `Y` and then run `ionic serve` again. Your browser should open up at localhost:8101.

*Don't worry if you're thrown an error!* This only happens the first time. Open up dev tools and select an iPhone in landscape orientation, refresh the page, and close out the error.

Click Random at the bottom of the screen to start off with your first kaomoji. Then enjoy!

### To Run on a Device

Run the following:

```bash
$ ionic cordova platform add ios
$ ionic build ios
```

Connect your iPhone to your computer.
Open up Xcode, open /platforms/ios/Kaomoji.xcodeproj and press Play. You may need to code sign with a development account.