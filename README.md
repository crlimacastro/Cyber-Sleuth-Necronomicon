# Cyber Sleuth's Necronomicon
Digivolution compendium for Digimon Story Cyber Sleuth

Link to Application: <https://people.rit.edu/crl3554/330/project3/>

My portfolio: <https://crlimacastro.github.io/>

# Documentation

## Contents

[Proposal](#Proposal)

[Requirements](#Requirements)

[What went right & wrong](#What-went-right-&-what-went-wrong)

[Citations](#Citations)

[Log](#Log)

------------------------------------

## Proposal

1) Cyber Sleuth's Necronomicon

A companion app for the video game "Digimon Story Cyber Sleuth".

It can be used to quickly reference back to and navigate the complicated interconnected webs that are digivolution trees.

Users can search for a specific digimon they want by name and filter their search by stage, type, attribute, etc. Users will be able to easily and quickly navigate visual representations of that digimon's digivolution line to learn how to evolve to it. They can also preview information such as the digimon's type, attribute, and skill. They can also easily navigate to its Digimon Fandom wiki page to learn more about it.

2) API's used:

Digimon Story Cyber Sleuth API - https://github.com/SirAirdude/GA-Project-2-DSCS-API

Used to get information about a digimon related to the game (digivolution line, attribute, skill, etc.).

MediaWiki API - https://digimon.fandom.com/api.php

Used to reliably obtain data such as images of a digimon from its wiki Fandom page.

Used to get links to that digimon's article for the user to easily navigate there.

------------------------------------

## Requirements

### A. Overall Theme/Impact

#### Theme

Thanks to the styling magic of Bootstrap Vue, the page has a very clean layout. Everything is very spaced out with enough room to breathe and even as the screen real estate decreases, the elements position themselves in such a way to maintain readability and proper proximity. The fonts and UI are meant to look modern to match the themes of technology and modernity of the Digimon series (although the bombastic digital world graphics the series is known for are toned down in favor of a more readable UI with a lot of negative space).

#### Engagement

For fans of the game and the series, this should be an engaging app. There are barely any interactable digivolution line charts on the web (mostly because these are not standardized. I am using only one of the games' interpretation of these digivolution lines). In order to explore around and see which Digimons can turn into which and examine how interconnected the web of digivolutions is you would normally have to boot up one of the games. Sometimes even looking at them through the games is restrictive as, usually, they do not let you see far ahead and (as they are RPGs) you have to grind for hours to evolve your Digimon and see what is ahead. This app is meant to be an accessible and readily available map to these complicated charts.

For players of the game (especially those who decide to play competitively in PvP matches) there is the added benefit of being able to easily look up a Digimon's Type, Attribute, and Skill in order to help create a balanced and effective team composition.

### B. User Experience

The site is responsive and perfectly usable in mobile devices. The Bootstrap framework allowed me to easily ensure responsiveness across devices and the general layout was designed with a mobile-first approach.

The application makes sure that the experience is as seamless as possible. I have minimized searching times in several ways to not hinder the user's flow as they are paging through the site.

The first time the site loads, a few Digimon are listed automatically so that the user knows exactly what the website is about and how it works. Other quality-of-life features have been coded in such as being able to search by pressing "Enter" on the text input control (removing the need to grab the mouse and press the "Search" button every time). Searches and the general state of the application are saved through the LocalStorage API. The site remembers where the user left off and will load back to that state when the user comes back to it.

### C. Media

[Preloader](https://icons8.com/preloaders/) at [Icons8.com](https://icons8.com/)

[Favicon and Placeholder](https://www.deviantart.com/wooded-wolf/art/Digimon-Adventure-Digivice-373796580) by [Wooded-Wolf](https://www.deviantart.com/wooded-wolf) at [DeviantArt.com](https://www.deviantart.com/)

#### Embedded Fonts

[Orbitron](https://fonts.google.com/specimen/Orbitron) by Matt McInerney

[Open Sans](https://fonts.google.com/specimen/Open+Sans) by Steve Matteson

### D. Code

#### Above and Beyond

The application is built with the Vue framework. Features such as Vue Components are used extensively throughout the program and all user controls are attached to fields that automatically update the Document Object Model.

There is asynchronous code all throughout the program. The methods of the Vue object which the controls call are asynchronous as well.

I created two proxy servers to be able to call both of the API's I used. On top of that, I also created my own two interfaces that communicated with these proxy servers and allowed me to further abstract and separate the code from the client with the server side.

------------------------------------

## What went right & what went wrong

This time around thankfully not much went wrong with the project. As finals approached a lot of work was thrown my way all at the same time from different classes so working on everything one by one became very stressful and left me with barely any time to work on this project regularly. Thankfully I had laid myself a solid groundwork before things started getting hectic and when I jumped back into the project, I was able to quickly pick it up thanks to all of the interfaces and carefully commented code.

The biggest thing to scare me was how long it took me to figure out how to fetch images from the MediaWiki API. It was a huge puzzle already to get to the image URLs in the maze-like objects I was getting back from the API. Then when I finally had the URLs, I could not do anything with them as creating image elements with them was not working. I was afraid of having to scrap one entire API when I had already built so much structure around it and when I had structured the entire project around these two interfaces co-working to serve a full experience. There weren't any replacements for my other API around the web so if I could not get them to work together, it was likely I would have had to scrap the entire project and start over after working on it for so long and just a week before it was due.

In the end, I didn't give up on the MediaWiki API though and through a lot of experimenting and cracking at its walls little by little, I finally did it! And now the visual aspects of the entire project are in safe hands (there was still a lot of work to do refining the searching algorithm even after I was able to fetch images, however).

Everything else about the project went smoothly. As I stated earlier, the parts of the project I felt confident about I was able to finish and have them ready very early on in development and that gave me a very good foundation and, more importantly, it provided me time to get the important functionalities mentioned above working.

### Wishlist of Features

If I had more time I would have worked on better pagination controls to sift through list results easier.
If the database used by the Digimon Cyber Sleuth API was bigger it would definitely be a necessary option 
as list results could easily come up with hundreds of pages. This is the first time I used Bootstrap and 
the first time I had used Vue for a project of this size, however, so I had a hard time learning how to code 
more advanced controls and styling options.

Another thing I would like to work on in the future is optimizing the page and the searching even further. Currently, the page elements load after everything is prepared. However, in the future I would definitely like to create a system where all of the images and data are being fetched in parallel asynchronously and everything is loaded in as it comes.

------------------------------------

## Citations

```javascript
// Helper function. Turns first letter of every word in string to uppercase
// https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toTitleCase(str) {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Turns first letter of every word in string to uppercase and joins them
// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function toUpperCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return word.toUpperCase();
    }).replace(/\s+/g, '');
}
```

------------------------------------

## Log

|   Date   | Description                                                                                                         |
|:--------:|---------------------------------------------------------------------------------------------------------------------|
| 11/12/20 | Created repo. Initial setup                                                                                         |
| 11/20/20 | Got both API's working and retrieving data                                                                          |
| 11/21/20 | Created interfaces for easily working with APIs. Created search and list all functionalities                        |
| 11/22/20 | Tweaked list functionality to only serve limited amounts. Made app visually appealing                               |
| 11/23/20 | Added state machine for app and polished for project checkpoint                                                     |
| 12/4/20  | Fixed images not showing up error. Implemented local storage. Added type and attribute icons. Added search on Enter |
| 12/5/20  | Added filters to listing action. Added placeholder image. Tweaked searching to find more images. Cleaned abstracts  |
| 12/6/20  | Polished the site and the code. Worked on the documentation. Worked on video demo                                   |
