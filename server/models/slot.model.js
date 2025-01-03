import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	slot: {
		type: String,
		required: true,
	},
	guests: {
		type: Number,
		required: true,
	},
});

export default mongoose.model("Booking", bookingSchema);
