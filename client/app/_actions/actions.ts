"use server";

import { slotDetails } from "@/utils/type";

const API_URL = "https://table-booking-53zw.onrender.com"
// const API_URL = "http://localhost:5000";

export const refreshSlots = async (date: string) => {
	const response = await fetch(`${API_URL}/getSlots?date=${date}`);
	const data = await response.json();

	console.log(data);

	if (response.status >= 200 && response.status <= 299) {
		return data.availableSlots;
	} else {
		throw new Error(`Failed to fetch slots: ${response.status}`);
	}
};

export const bookSlot = async (slotDetails: slotDetails) => {
	const { name, phone, guests, date, slot } = slotDetails;
	const response = await fetch(`${API_URL}/bookSlot`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			phone: parseInt(phone),
			guests: parseInt(guests),
			date,
			slot,
		}),
	});
	const body = await response.json();
	return {body, status: response.status};
};
