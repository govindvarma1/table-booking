import Booking from "../models/slot.model.js";

export const bookSlot = async (req, res, next) => {
	try {
		const { name, phone, guests, date, slot } = req.body;

		if (!name || !phone || !guests || !date || !slot) {
			return res.status(400).json({ message: "All fields are required." });
		}

        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
		const selectedDate = new Date(date);
        
		if (selectedDate.getDate() < today.getDate()) {
            return res
            .status(400)
            .json({ message: "You cannot book slots for past dates." });
		}
        
		if (selectedDate.toDateString() === today.toDateString()) {
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

			if (
				adjustedSlotHour < currentHour ||
				(adjustedSlotHour === currentHour && currentMinute > 0)
			) {
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

		const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
		const selectedDate = new Date(date);

		if (selectedDate.getDate() < today.getDate()) {
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

		if (selectedDate.getDate() === today.getDate()) {
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

				return (
					adjustedSlotHour > currentHour
				);
			});

			if (filteredSlots.length === 0) {
				return res
					.status(404)
					.json({ message: "No available slots for the selected time." });
			}

			return res.json({ availableSlots: filteredSlots });
		}

		return res.json({ availableSlots });
	} catch (error) {
		next(error);
	}
};