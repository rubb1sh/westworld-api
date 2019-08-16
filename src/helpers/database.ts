import { MongoClient, Db, Collection } from 'mongodb';

const { MONGODB_URI, DATABASE_NAME } = process.env;

if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
}

if (!DATABASE_NAME) {
    throw new Error('Missing DATABASE_NAME environment variable');
}

const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
});

const appConnection = client.connect();

const appDatabase = appConnection.then((connection) =>
    connection.db(DATABASE_NAME),
);

function getCollection<T = { _id: string; [key: string]: any }>(
    database: Promise<Db>,
    collectionName: string,
): Promise<Collection<T>> {
    return database.then((db) => db.collection(collectionName));
}

function getDbCollection<T = { _id: string; [key: string]: any }>(
    collectionName: string,
): Promise<Collection<T>> {
    return getCollection(appDatabase, collectionName);
}

export { getDbCollection, getCollection };
export default appDatabase;
