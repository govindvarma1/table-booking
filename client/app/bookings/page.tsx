"use client";
import { useEffect, useState } from "react";
import { getBookings } from "./_actions/actions";
import BookingList from "./_components/bookingList";
import BookingsSkeleton from "./loading";
import Navbar from "../_components/navbar";

export default function BookingsPage() {
	const [loading, setLoading] = useState<boolean>(true);
	const [pastBookings, setPastBookings] = useState<any[]>([]);
	const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
	const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

	const handleTabSwitch = (tab: "upcoming" | "past") => {
		setActiveTab(tab);
	};

	useEffect(() => {
		setLoading(true);
		const fetchBookings = async () => {
			const { pastSlots, upcomingSlots } = await getBookings();

			setPastBookings(pastSlots);
			setUpcomingBookings(upcomingSlots);
		};

		fetchBookings();
		setLoading(false);
	}, []);

	const handleDeleteBooking = async (bookingId: string) => {
		try {
			setPastBookings(
				pastBookings.filter((booking) => booking.id !== bookingId)
			);
			setUpcomingBookings(
				upcomingBookings.filter((booking) => booking.id !== bookingId)
			);
		} catch (error) {
			console.error("Error deleting booking:", error);
		}
	};

	return (
		<>
			<Navbar />
			{loading ? (
				<BookingsSkeleton />
			) : (
				<section className="px-16 py-2 max-[450px]:px-4">
					<h2 className="text-2xl font-bold mb-4">Bookings</h2>

					<div className="flex gap-6 mb-4">
						<button
							onClick={() => handleTabSwitch("upcoming")}
							className={`font-semibold ${
								activeTab === "upcoming" ? "text-blue-500" : "text-gray-700"
							}`}
						>
							Upcoming Bookings
						</button>
						<button
							onClick={() => handleTabSwitch("past")}
							className={`font-semibold ${
								activeTab === "past" ? "text-blue-500" : "text-gray-700"
							}`}
						>
							Past Bookings
						</button>
					</div>

					{activeTab === "upcoming" && (
						<div>
							<h3 className="text-xl font-semibold">Upcoming Bookings</h3>
							<BookingList
								bookings={upcomingBookings}
								type="Upcoming"
								onDeleteBooking={handleDeleteBooking}
							/>
						</div>
					)}

					{activeTab === "past" && (
						<div className="mt-8">
							<h3 className="text-xl font-semibold">Past Bookings</h3>
							<BookingList
								bookings={pastBookings}
								type="Past"
								onDeleteBooking={handleDeleteBooking}
							/>
						</div>
					)}
				</section>
			)}
		</>
	);
}
