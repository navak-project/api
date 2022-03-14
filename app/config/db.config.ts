import 'dotenv/config'
export = {
  url: `mongodb://${process.env.MONGODB}/${process.env.DB}`
};