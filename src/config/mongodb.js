import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017/ecomdb";

let client;

export const MongodbConnection = () => {
  MongoClient.connect(url)
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
