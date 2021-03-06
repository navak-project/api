module.exports = (mongoose: any) => {
  const Fixture = mongoose.model(
    'fixture',
    mongoose.Schema({
      id: {
        type: String,
        required: false,
        default: '0000'
      },
      name: {
          type: String,
          required: false,
          default: 'fixture'
      },
      universe: {
          type: Number,
          required: false,
          default: 100
      },
      address: {
          type: Number,
          required: false,
          default: 1
      },
      area:{
          type: String,
          required: false,
          default: 'None'
      },
      fixtureType:{
          type: Number,
          required: false,
          default: 0,
      }
    })
  );
  return Fixture;
};