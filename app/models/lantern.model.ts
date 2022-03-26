module.exports = (mongoose: any) => {
  const Lantern = mongoose.model(
    'lantern',
    mongoose.Schema({
      id: {
        type: String,
        required: false,
        default: '0000'
      },
      hostName: {
        type: String,
        required: true
      },
      macAddress: {
        type: String,
        required: true
      },
      ipAddress: {
        type: String,
        required: true
      },
      startUniverse: {
        type: Number,
        required: false,
        default: 0
      },
      pulse: {
        type: Number,
        required: false,
        default: 0
      },
      rgb: {
        type: String,
        required: false,
        default: '0,0,0,1'
      },
      status: {
        type: Boolean,
        required: false,
        default: false
      },
      group: {
        type: Number,
        required: true,
        default: 1
      },
      battery: {
        type: Number,
        required: false,
        default: 0
      },
      wifiSignal: {
        type: Number,
        required: false,
        default: 0
      },
      picked: {
        type: Boolean,
        required: true,
        default: false,
      },
    })
  );
  return Lantern;
};
