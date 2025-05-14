let config = {};

const configStore = {
    get: () => config,
    update: (newConfig) => {
        config = { ...newConfig };
    }
};

export default configStore;
