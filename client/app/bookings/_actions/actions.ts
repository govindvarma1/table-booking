'use server'
const API_URL = "https://table-booking-53zw.onrender.com"
// const API_URL = "http://localhost:5000";

export const getBookings = async() => {
    const response = await fetch(`${API_URL}/getBookings`);
    const {pastSlots, upcomingSlots} = await response.json();
    return {pastSlots, upcomingSlots};
}