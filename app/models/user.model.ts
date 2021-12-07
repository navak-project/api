module.exports = (mongoose: any) => {
  const User = mongoose.model(
    "user",
 mongoose.Schema({
   id: {
       type: String,
       required: false,
       default: "0000"
   },
   hostName: {
       type: String,
       required: false
   },
   macAddress: {
       type: String,
       required: false
   },
   ipAddress: {
       type: String,
       required: false,
   },
   startUniverse: {
       type: Number,
       required: false,
       default: 0
   },
   pulse:{
       type: Number,
       required: false,
       default: 0
   },
   rgb:{
    type: String,
    required: false,
    default: 'rgb(0,0,0)'
     },
   status:{
       type: Boolean,
       required: false,
       default: false
     },
   group:{
    type: Number,
    required: true,
    default: 1
   },
 })
  );
  return User;
};