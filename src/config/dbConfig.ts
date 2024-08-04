import dictionary from './dictionary';
import enviroments from './envConfig';
import mongoose from 'mongoose';

export type DB_ID = mongoose.Types.ObjectId;

const url: string | undefined = enviroments.MONGO_DB;
const connect = () => {
  if (!url) {
    throw new Error(dictionary.noUrl);
  }
  mongoose
    .connect(url)
    .then(() => {
      console.log(dictionary.connectedToDb);
    })
    .catch((err: Error) => {
      throw err;
    });
};

export default connect;
