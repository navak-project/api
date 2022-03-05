module.exports = (mongoose: any) => {
	const Station = mongoose.model(
		'station',
		mongoose.Schema({
			id: {
				type: String,
				required: true
			},
			ip: {
				type: String,
				required: false
			},
			universe: {
				type: String,
				required: false
			},
			state: {
				type: Number,
				required: false,
				default: 0
			},
			rgb: {
				type: String,
				required: false,
				default: '0,0,0,255'
			},
			metrics: 
      {
        type: {
          message: {type: String, required: true, default:null },
        },
      }
		})
	);
	return Station;
};
