const kvStore = new Map();

const createUser = async (user) => {
    kvStore.set(`users:${user.email}`, user);
};

const findUserByEmail = async (email) => {
    return kvStore.get(`users:${email}`) || null;
};

export { createUser, findUserByEmail };