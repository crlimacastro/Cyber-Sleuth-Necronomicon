# IGME-330-Project3
Digivolution compendium for Digimon Story Cyber Sleuth

Link to Application: TODO

Video Reel: TODO

My portfolio: <https://crlimacastro.github.io/>

# Documentation

## Contents

[Proposal](#Proposal)

[Requirements](#Requirements)

[What went right & wrong](#What-went-right-&-what-went-wrong)

[Self Assessment](#Self-Assessment)

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

4) I will be working solo.

------------------------------------

## Requirements

### A. Overall Theme/Impact

#### Theme

TODO

#### Engagement

TODO

### B. User Experience

TODO

### C. Media

[Preloader](https://icons8.com/preloaders/) at [Icons8.com](https://icons8.com/)

[Favicon](https://www.deviantart.com/wooded-wolf/art/Digimon-Adventure-Digivice-373796580) by [Wooded-Wolf](https://www.deviantart.com/wooded-wolf) at [DeviantArt.com](https://www.deviantart.com/)

#### Embedded Fonts

[Orbitron](https://fonts.google.com/specimen/Orbitron) by Matt McInerney

[Open Sans](https://fonts.google.com/specimen/Open+Sans) by Steve Matteson

### D. Code

#### Above and Beyond

TODO

------------------------------------

## What went right & what went wrong

TODO

### Wishlist of Features

TODO

------------------------------------

## Self-Assessment

TODO

**Grade** - TODO

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
| 12/5/20  |                                                                                                                     |