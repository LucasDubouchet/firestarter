const randomHelper = {
    isTakingFire(percentChance) {
        return Math.floor(Math.random() * 100) < percentChance;
    }
};

export default randomHelper;