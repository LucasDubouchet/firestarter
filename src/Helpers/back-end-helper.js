const SERVER_URL = "http://localhost:3000/"

const backEndHelper = {
    getTestInitialFirePositions() {
        return [ {x: 4, y:2}, {x: 5, y:5} ];
    },

    async fetchInitialFirePositions() {
        const reponse = await fetch(SERVER_URL + "initialFires");
        const initialFires = await reponse.json();
        return initialFires;
    },

    async fetchWidth() {
        const reponse = await fetch(SERVER_URL + "width");
        const width = await reponse.json();
        return width;
    },

    async fetchHeight() {
        const reponse = await fetch(SERVER_URL + "height");
        const height = await reponse.json();
        return height;
    },

    async fetchFireProbabilityPercentage() {
        const reponse = await fetch(SERVER_URL + "fireProbabilityPercentage");
        const fireProbabilityPercentage = await reponse.json();
        return fireProbabilityPercentage;
    },

    getTestFireProbabilityPercentage() {
        return 45;
    }
};

export default backEndHelper;