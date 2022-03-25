module.exports = (mongoose: any) => {
  const Station = mongoose.model(
    "station",
    mongoose.Schema({
      id: {
        type: String,
        required: true
      },
      ipAddress: {
        type: String,
        required: true
      },
      universe: {
        type: String,
        required: false
      },
      rgb: {
        type: String,
        required: false,
        default: '0,0,0,255'
      },
      bpm: {
        type: Number,
        default: 0,
      },
      message: {
        type: String,
        default: '-',
      },
      state: {
        type: Number,
        default: 0,
      },
      status: {
        type: Boolean,
        default: false,
      },
      lantern: {
        type: String,
        default: '-',
      },
      timer: {
        type: String,
        default: '00:00:15',
      },
      presence: {
        type: Boolean,
        default: false,
      },
      metrics: {
        type: {
        },
      }
    })
  );
  return Station;
};
