class Digimon {
    constructor(digiInfo, wikiInfo) {
        // Game info
        this.name = digiInfo.name;
        this.id = digiInfo._id;
        this.stage = digiInfo.stage;
        this.type = digiInfo.type;
        this.attribute = digiInfo.attribute;
        this.skill = digiInfo.skill;
        this.degeneratesTo = digiInfo.degeneratesTo;
        this.digivolvesTo = digiInfo.digivolvesTo;

        // Wiki info
        this.image = wikiInfo.image;
        this.abstract = wikiInfo.abstract;
        this.url = wikiInfo.url;
    }
}

class DigimonPreview {
    constructor(name, image) {
        this.name = name;
        this.image = image;
    }
}

class Skill {
    constructor(name, description, id) {
        this.name = name;
        this.id = id;
        this.description = description;
    }
}

export { Digimon, DigimonPreview, Skill };