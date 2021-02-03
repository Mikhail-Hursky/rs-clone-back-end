import {Collection, MongoClient, ObjectId} from 'mongodb';

const {MONGO_DB_USERNAME, MONGO_DB_PASSWORD} = process.env

type User = {
    avatar: string,
    url: string,
    login: string,
    node_id: string,
    totalScore:number
    race: number,
    tetris: number,
    breakout: number,
    flappyBird: number,
    spaceAttack: number,
    snake: number,
    snow: number,
}

type GitUser = {
    avatar_url: string
    bio: any
    blog: string
    company: any
    created_at: string
    email: any
    events_url: string
    followers: number
    followers_url: string
    following: number
    following_url: string
    gists_url: string
    gravatar_id: string
    hireable: any
    html_url: string
    id: number
    location: any
    login: string
    name: any
    node_id: string
    organizations_url: string
    public_gists: number
    public_repos: number
    received_events_url: string
    repos_url: string
    site_admin: boolean
    starred_url: string
    subscriptions_url: string
    twitter_username: any
    type: string
    updated_at: string
    url: string
}

const url = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@score.k7ig6.mongodb.net/?retryWrites=true&w=majority`;

const dbName = 'Score';
const collectionName = 'Users';

const getMongoInstance = async () => {
    const client = await MongoClient.connect(url);

    return client.db(dbName);
}

const getCollection = async (): Promise<Collection> => {
    const db = await getMongoInstance();

    return db.collection(collectionName);
}

const listAll = async () => {
    const collection = await getCollection();

    return collection.find({}).toArray();
};

const getById = async (node_id: string, userGitHub:GitUser) => {
    const collection = await getCollection();

    let user = await collection.findOne({ node_id });

    if (user === null) {
        const newUser = {
            avatar: userGitHub.avatar_url,
            url: userGitHub.html_url,
            login: userGitHub.login,
            node_id: userGitHub.node_id,
            totalScore:0,
            race: 0,
            tetris: 0,
            breakout: 0,
            flappyBird: 0,
            spaceAttack: 0,
            snake: 0,
            snow: 0,
        }
        return await crete(newUser);
    }

    if(user.avatar !== userGitHub.avatar_url || user.login !== userGitHub.login) {
        user.avatar = userGitHub.avatar_url;
        user.login = userGitHub.login
        user = await updateById(user.node_id, user);
    }

    return user;
};

const getByIdUserLogin = async (node_id: string,) => {
    const collection = await getCollection();

    const user = await collection.findOne({ node_id });

    return user;
};

const crete = async (item: User) => {
    const collection = await getCollection();

    const response = await collection.insertOne(item);

    return response.ops[0];
};

const updateById = async (node_id: string, item: User) => {
    const collection = await getCollection();

    const response = await collection.replaceOne({ node_id }, item);

    return response.ops[0];
};

export {
    listAll,
    getById,
    crete,
    updateById,
    getByIdUserLogin,
}
