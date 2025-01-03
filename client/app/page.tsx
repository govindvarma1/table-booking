"use client";
import { useEffect, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FormDataType } from "@/utils/type";
import Navbar from "./_components/navbar";

const BookingForm = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [formData, setFormData] = useState<FormDataType>({
		name: "",
		phone: "",
		guests: "",
		slot: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		phone: "",
		guests: "",
		date: "",
	});

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		console.log(value);
		setFormData({ ...formData, [name]: value });
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const handleSlotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {value} = event.target;
		setFormData((prev) => ({...prev, slot: value}))
	}

	const handleDateChange: CalendarProps["onChange"] = (value) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (value instanceof Date) {
			if (value < today) {
				setErrors((prev) => ({
					...prev,
					date: "You cannot book past dates.",
				}));
				setAvailableSlots([]);
				return;
			}

			setSelectedDate(value);
			setErrors((prev) => ({ ...prev, date: "" }));
			setAvailableSlots(["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]);
		} else {
			setErrors((prev) => ({ ...prev, date: "Invalid date selection." }));
		}
	};

	const validateName = (name: string) =>
		/^[A-Za-z\s]+$/.test(name) ? "" : "Name must contain only alphabets.";

	const validatePhoneNumber = (phone: string) =>
		/^\d{10}$/.test(phone) ? "" : "Phone number must be exactly 10 digits.";

	const validateSubmit = () => {
		const { name, phone, guests } = formData;
		let isValid = true;

		const newErrors = {
			name: validateName(name),
			phone: validatePhoneNumber(phone),
			guests: guests ? "" : "Number of guests is required.",
			date: "",
		};

		if (!guests) newErrors.guests = "Number of guests is required.";
		if (!selectedDate) newErrors.date = "Please select a date.";

		for (const error in newErrors) {
			if (newErrors[error as keyof typeof newErrors]) isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (validateSubmit()) {
			console.log("Booking successful!", formData, selectedDate);
		}
	};

	return (
		<section className="px-16 py-4">
			<Navbar />
			<div className="w-full flex justify-center">
				<div>
					<h2 className="text-2xl font-bold mb-4">Book a Table</h2>
					<form onSubmit={handleSubmit} className="max-w-[350px]">
						<div className="mb-4">
							<label className="block text-sm font-medium">Name</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className={`w-full p-2 border rounded mt-1 ${
									errors.name ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">{errors.name}</p>
							)}
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium">Phone Number</label>
							<input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								className={`w-full p-2 border rounded mt-1 ${
									errors.phone ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.phone && (
								<p className="text-red-500 text-sm mt-1">{errors.phone}</p>
							)}
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium">
								Number of Guests
							</label>
							<input
								type="number"
								name="guests"
								value={formData.guests}
								onChange={handleChange}
								className={`w-full p-2 border rounded mt-1 ${
									errors.guests ? "border-red-500" : "border-gray-300"
								}`}
								min="1"
								max="20"
							/>
							{errors.guests && (
								<p className="text-red-500 text-sm mt-1">{errors.guests}</p>
							)}
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium">Select Date</label>
							<Calendar
								onChange={handleDateChange}
								value={selectedDate}
								className="rounded-md p-2 font-semibold"
							/>
							{errors.date && (
								<p className="text-red-500 text-sm mt-1">{errors.date}</p>
							)}
						</div>
						<div className="mb-4">
							<h3 className="font-medium text-sm">Available Slots:</h3>
							<div className="mt-2">
								{availableSlots.length > 0 ? (
									<select
										className="p-2 border rounded bg-gray-100 hover:bg-gray-200 w-full"
										name="slot"
										value={formData.slot}
										onChange={handleSlotChange}
									>
										<option value="" disabled>
											Select a slot
										</option>
										{availableSlots.map((slot) => (
											<option key={slot} value={slot}>
												{slot}
											</option>
										))}
									</select>
								) : (
									<p className="text-red-500">No slots available</p>
								)}
							</div>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-500 text-white p-2 rounded mt-4"
						>
							Confirm Booking
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default BookingForm;
