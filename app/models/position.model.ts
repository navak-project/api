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
      position: {
        type: String,
        required: true,
        default: '0,0,0'
      },
      size: {
        type: String,
        required: true,
        default: '0.0'
      },
		
		})
	);
	return Position;
};
