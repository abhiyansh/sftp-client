let config = {};

module.exports = {
    get: () => config,
    update: (newConfig) => {
        config = { ...newConfig };
    }
};
