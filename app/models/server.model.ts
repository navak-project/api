module.exports = (mongoose: any) => {
  const Server = mongoose.model(
    "server",
    mongoose.Schema({
      ipAdress: {
        type: String,
        required: true
      },
      status: {
        type: Boolean,
        default: false,
      },
    })
  );
  return Server;
};
