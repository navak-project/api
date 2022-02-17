module.exports = (mongoose: any) => {
	const Position = mongoose.model(
		'position',
		mongoose.Schema({
			id: {
				type: String,
				required: false,
				default: '0000'
			},
			name: {
				type: String,
				required: true
      },
      x: {
        type: String,
        required: true,
        default: '0'
      },
      y: {
        type: String,
        required: true,
        default: '0'
      },
      z: {
        type: String,
        required: true,
        default: '0'
      },
      size: {
        type: String,
        required: true,
        default: '0.0'
      },
      group: {
        type: String,
        required: true,
        default: '0'
      },
		
		})
	);
	return Position;
};
