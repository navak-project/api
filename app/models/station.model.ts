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
			metrics: {
				type: {
					message: {type: String, required: false, default: 'none'},
					lantern: {type: String, required: false, default: 'none'},
					bpm: {type: Number, required: false, default: 70},
					state: {type: String, required: false, default: 0},
					timer: {type: String, required: false, default: '00:00:00'},
					presence: {type: String, required: false, default: false}
				}
			}
		})
	);
	return Station;
};
