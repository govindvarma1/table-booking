"use client";

import { useEffect, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "./_components/navbar";
import { bookSlot, refreshSlots } from "./_actions/actions";
import { bookingDetails, FormDataType } from "@/utils/type";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationModal from "./_components/conformationModel";

const formatDate = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
		2,
		"0"
	)}-${String(date.getDate()).padStart(2, "0")}`;
};

const validateInput = (name: string, value: string): string => {
	switch (name) {
		case "name":
			return /^[A-Za-z\s]+$/.test(value)
				? ""
				: "Name must contain only alphabets.";
		case "phone":
			return /^\d{10}$/.test(value)
				? ""
				: "Phone number must be exactly 10 digits.";
		case "guests":
			return value ? "" : "Number of guests is required.";
		default:
			return "";
	}
};

const BookingForm = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate()
	));
	const [availableSlots, setAvailableSlots] = useState<string[]>([]);
	const [isBooking, setIsBooking] = useState<boolean>(false);
	const [bookingDetails, setBookingDetails] = useState<bookingDetails | null>(null);
	const [isSlotsLoading, setIsSlotsLoading] = useState<boolean>(true);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [formData, setFormData] = useState<FormDataType>({
		name: "",
		phone: "",
		guests: "",
		slot: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		const fetchSlots = async () => {
			try {
				setIsSlotsLoading(true);
				const formattedDate = formatDate(selectedDate);
				const newSlots = await refreshSlots(formattedDate);
				setAvailableSlots(newSlots);
				setFormData((prev) => ({ ...prev, slot: "" }));
			} catch (error) {
				console.error("Error fetching slots:", error);
			} finally {
				setIsSlotsLoading(false);
			}
		};
		fetchSlots();
	}, [selectedDate]);

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
	};

	const handleDateChange: CalendarProps["onChange"] = (value) => {
		if (value instanceof Date) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
	
			const normalizedDate = new Date(
				value.getFullYear(),
				value.getMonth(),
				value.getDate()
			);
	
			if (normalizedDate < today) {
				setErrors((prev) => ({ ...prev, date: "You cannot book past dates." }));
				setAvailableSlots([]);
				return;
			}
	
			setErrors((prev) => ({ ...prev, date: "" }));
			setSelectedDate(normalizedDate);
		} else {
			setErrors((prev) => ({ ...prev, date: "Invalid date selection." }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};
		Object.entries(formData).forEach(([key, value]) => {
			newErrors[key] = validateInput(key, value);
		});

		if (!selectedDate) newErrors.date = "Please select a date.";
		setErrors(newErrors);

		return Object.values(newErrors).every((error) => !error);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (validateForm()) {
			setIsBooking(true);
			try {
				const formattedDate = formatDate(selectedDate);
				const response = await bookSlot({ ...formData, date: formattedDate });
				const { body, status } = response;
				if (status !== 201) {
					toast.error(body.message);
					return;
				} else {
					toast.success("Booking successful!!");
					setFormData({
						name: "",
						phone: "",
						guests: "",
						slot: "",
					});
					setSelectedDate(new Date());
					setBookingDetails(body.newBooking);
					setIsModalOpen(true);
				}
			} catch (error) {
				console.error("Error booking slot:", error);
				toast.error("Failed to confirm booking. Please try again.");
			} finally {
				setIsBooking(false);
			}
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<section>
			<Navbar />
			<div className="w-full flex justify-center mb-12">
				<div>
					<h2 className="text-2xl font-bold mb-4">Book a Table</h2>
					<form onSubmit={handleSubmit} className="max-w-[350px]">
						<InputField
							label="Name"
							name="name"
							type="text"
							value={formData.name}
							error={errors.name}
							onChange={handleChange}
						/>

						<InputField
							label="Phone Number"
							name="phone"
							type="tel"
							value={formData.phone}
							error={errors.phone}
							onChange={handleChange}
						/>

						<InputField
							label="Number of Guests"
							name="guests"
							type="number"
							value={formData.guests}
							error={errors.guests}
							onChange={handleChange}
							min="1"
							max="20"
						/>

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
								{isSlotsLoading ? (
									<p className="text-blue-500">Fetching slots...</p>
								) : availableSlots.length > 0 ? (
									<select
										className="p-2 border rounded bg-gray-100 hover:bg-gray-200 w-full cursor-pointer"
										name="slot"
										value={formData.slot}
										onChange={handleChange}
									>
										<option value="" disabled>
											Select a slot
										</option>
										{availableSlots.map((slot) => (
											<option
												key={slot}
												value={slot}
												className="cursor-pointer"
											>
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
							className={`w-full bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer ${
								isBooking && "bg-blue-400"
							}`}
							disabled={isBooking}
						>
							{isBooking ? (
								<div className="w-full flex justify-center">
									<LoaderCircle className="animate-spin" />
								</div>
							) : (
								"Confirm Booking"
							)}
						</button>
					</form>
				</div>
			</div>
			<ConfirmationModal
				isOpen={isModalOpen}
				bookingDetails={bookingDetails}
				onClose={closeModal}
			/>
		</section>
	);
};

const InputField = ({
	label,
	name,
	type,
	value,
	error,
	onChange,
	...props
}: {
	label: string;
	name: string;
	type: string;
	value: string;
	error?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	[key: string]: any;
}) => (
	<div className="mb-4">
		<label className="block text-sm font-medium">{label}</label>
		<input
			type={type}
			name={name}
			value={value}
			onChange={onChange}
			className={`w-full p-2 border rounded mt-1 ${
				error ? "border-red-500" : "border-gray-300"
			}`}
			{...props}
		/>
		{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
	</div>
);

export default BookingForm;
