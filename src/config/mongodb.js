import { MongoClient } from "mongodb";

let client;

export const MongodbConnection = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("MongoDb is Connected.");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDb = () => {
  return client.db();
};
