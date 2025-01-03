import React from "react";
import moment from "moment";

interface Booking {
	id: string;
	name: string;
	guests: number;
	date: string;
	slot: string;
}

interface BookingListProps {
	bookings: Booking[];
	type: "Upcoming" | "Past";
	onDeleteBooking: (id: string) => void;
}

const BookingList: React.FC<BookingListProps> = ({
	bookings,
	type,
	onDeleteBooking,
}) => {
	return (
		<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{bookings.length > 0 ? (
				bookings.map((booking) => (
					<div
						key={booking.id}
						className="p-4 border border-gray-200 rounded-lg"
					>
						<div>
							<strong>{booking.name}</strong> - {booking.guests} guests
						</div>
						<div>{moment(booking.date).format("MMMM D, YYYY")}</div>

						<div>Slot: {booking.slot}</div>
						{/* <button
                            onClick={() => onDeleteBooking(booking.id)}
                            className="text-red-500 mt-2 hover:underline"
                        >
                            Delete
                        </button> */}
					</div>
				))
			) : (
				<p>No {type} bookings.</p>
			)}
		</div>
	);
};

export default BookingList;
