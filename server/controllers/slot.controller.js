import Booking from "../models/slot.model.js";
import moment from "moment-timezone";

export const bookSlot = async (req, res, next) => {
	try {
		const { name, phone, guests, date, slot } = req.body;

		if (!name || !phone || !guests || !date || !slot) {
			return res.status(400).json({ message: "All fields are required." });
		}

		const today = new Date(
			new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
		);
		const selectedDate = new Date(date);

		if (
			selectedDate.toISOString().split("T")[0] <
			today.toISOString().split("T")[0]
		) {
			return res
				.status(400)
				.json({ message: "You cannot book slots for past dates." });
		}

		if (
			selectedDate.toISOString().split("T")[0] ===
			today.toISOString().split("T")[0]
		) {
			const currentHour = today.getHours();
			const currentMinute = today.getMinutes();

			const slotHour = parseInt(slot.split(":")[0], 10);
			const slotPeriod = slot.split(" ")[1];
			const isPM = slotPeriod === "PM";
			const adjustedSlotHour = isPM
				? slotHour === 12
					? 12
					: slotHour + 12
				: slotHour === 12
				? 0
				: slotHour;

			if (adjustedSlotHour < currentHour) {
				return res.status(400).json({ message: "You cannot book past slots." });
			}
		}

		const existingBooking = await Booking.findOne({
			date: new Date(date),
			slot,
		});

		if (existingBooking) {
			return res.status(400).json({ message: "This slot is already booked." });
		}

		const newBooking = new Booking({
			name,
			phone,
			guests,
			date: new Date(date),
			slot,
		});

		await newBooking.save();

		return res.status(201).json({ message: "Booking successful!", newBooking });
	} catch (error) {
		next(error);
	}
};

export const getAvailableSlots = async (req, res, next) => {
	try {
		const { date } = req.query;
		if (!date) {
			return res.status(400).json({ message: "Date is required." });
		}

		const today = new Date(
			new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
		);
		const selectedDate = new Date(date);

		if (
			selectedDate.toISOString().split("T")[0] <
			today.toISOString().split("T")[0]
		) {
			return res
				.status(400)
				.json({ message: "You cannot book slots for past dates." });
		}

		const availableSlots = [
			"10:00 AM",
			"11:00 AM",
			"12:00 PM",
			"01:00 PM",
			"02:00 PM",
			"03:00 PM",
			"04:00 PM",
			"05:00 PM",
			"06:00 PM",
			"07:00 PM",
			"08:00 PM",
			"09:00 PM",
			"10:00 PM",
		];

		const bookingDetails = await Booking.find({ date: selectedDate }).select(
			"slot"
		);
		const bookedSlots = bookingDetails.map((booking) => booking.slot);

		console.log(bookedSlots);

		console.log(
			`${selectedDate.toISOString().split("T")[0]} ${
				today.toISOString().split("T")[0]
			}`
		);

		if (
			selectedDate.toISOString().split("T")[0] ===
			today.toISOString().split("T")[0]
		) {
			const currentHour = today.getHours();

			const filteredSlots = availableSlots.filter((slot) => {
				const slotHour = parseInt(slot.split(":")[0], 10);
				const slotPeriod = slot.split(" ")[1];
				const isPM = slotPeriod === "PM";
				const adjustedSlotHour = isPM
					? slotHour === 12
						? 12
						: slotHour + 12
					: slotHour === 12
					? 0
					: slotHour;

				return adjustedSlotHour > currentHour && !bookedSlots.includes(slot);
			});

			if (filteredSlots.length === 0) {
				return res
					.status(404)
					.json({ message: "No available slots for the selected time." });
			}

			return res.status(200).json({ availableSlots: filteredSlots });
		} else {
			const filteredSlots = availableSlots.filter(
				(slot) => !bookedSlots.includes(slot)
			);
			return res.json({ availableSlots: filteredSlots });
		}
	} catch (error) {
		next(error);
	}
};

export const getAllBookings = async (req, res, next) => {
	try {
		const allBookings = await Booking.find();
		const currentDateTime = moment().tz("asia/kolkata");
		console.log(currentDateTime);
		const pastSlots = [];
		const upcomingSlots = [];
		allBookings.forEach((booking) => {
			const bookingDate = moment(booking.date).tz("asia/kolkata");
			const bookingTime = moment(`${booking.slot}`, "hh:mm A");

			const combinedBookingDateTime = bookingDate.set({
				hour: bookingTime.hour(),
				minute: bookingTime.minute(),
				second: 0,
				millisecond: 0,
			});
			console.log(currentDateTime);
			if (combinedBookingDateTime.isBefore(currentDateTime)) {
				pastSlots.push(booking);
			} else {
				upcomingSlots.push(booking);
			}
		});

		upcomingSlots.sort((a, b) => {
			const aDateTime = moment(a.date).set({
				hour: moment(`${a.slot}`, "hh:mm A").hour(),
				minute: moment(`${a.slot}`, "hh:mm A").minute(),
			});
			const bDateTime = moment(b.date).set({
				hour: moment(`${b.slot}`, "hh:mm A").hour(),
				minute: moment(`${b.slot}`, "hh:mm A").minute(),
			});

			return aDateTime.isBefore(bDateTime)
				? -1
				: aDateTime.isAfter(bDateTime)
				? 1
				: 0;
		});

		pastSlots.sort((a, b) => {
			const aDateTime = moment(a.date).set({
				hour: moment(`${a.slot}`, "hh:mm A").hour(),
				minute: moment(`${a.slot}`, "hh:mm A").minute(),
			});
			const bDateTime = moment(b.date).set({
				hour: moment(`${b.slot}`, "hh:mm A").hour(),
				minute: moment(`${b.slot}`, "hh:mm A").minute(),
			});

			return aDateTime.isAfter(bDateTime)
				? -1
				: aDateTime.isBefore(bDateTime)
				? 1
				: 0;
		});

		return res.status(200).send({
			pastSlots,
			upcomingSlots,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteSlot = async (req, res, next) => {
	try {
		const { id } = req.query;

		if (!id) {
			return res.status(400).json({
				success: false,
				message: "Booking ID is required",
			});
		}

		const booking = await Booking.findById(id);

		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found",
			});
		}

		await booking.deleteOne({ _id: id });

		return res.status(200).json({
			success: true,
			message: "Booking deleted successfully",
			deletedBooking: booking,
		});
	} catch (error) {
		next(error);
	}
};
