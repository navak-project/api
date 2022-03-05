import 'dotenv/config'
console.log("🚀 ~ file: db.config.ts ~ line 4 ~ process.env.MONGODB", process.env.MONGODB);
export = {
  url: `mongodb://${process.env.MONGODB}:27017/navak`
};