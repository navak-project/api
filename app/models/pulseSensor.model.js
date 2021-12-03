module.exports = mongoose => {
  const Pulsesensor = mongoose.model(
    "pulsesensor",
    mongoose.Schema({
      id: {
        type: String,
        required: true
      },
      universe: {
        type: String,
        required: false
      },
      state: {
        type: Number,
        required: false,
        default: 0,
      },
      rgb: {
        type: String,
        required: false,
        default: '0,0,0,255'
      },
    })
  );
  return Pulsesensor;
};