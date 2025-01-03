import React, { useEffect, useRef } from "react";
import moment from "moment"; 

interface ConfirmationModalProps {
	isOpen: boolean;
	bookingDetails: {
		name: string;
		guests: number;
		date: string;
		slot: string;
		phone: string;
	} | null;
	onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	isOpen,
	bookingDetails,
	onClose,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div
				ref={modalRef}
				className="bg-white p-6 rounded-md max-w-sm w-full animate-pop-out"
			>
				<h2 className="text-2xl font-semibold">Booking Confirmed!</h2>
				{bookingDetails && (
					<div className="mt-4">
						<p>
							<strong>Name:</strong> {bookingDetails.name}
						</p>
						<p>
							<strong>Guests:</strong> {bookingDetails.guests}
						</p>
						<p>
							<strong>Phone:</strong> {bookingDetails.phone}
						</p>
						<p>
							<strong>Date:</strong>{" "}
							{moment(bookingDetails.date).format("MMMM D, YYYY")}
						</p>
						<p>
							<strong>Slot:</strong> {bookingDetails.slot}
						</p>
					</div>
				)}
				<div className="mt-4 flex justify-end">
					<button
						onClick={onClose}
						className="bg-blue-500 text-white px-4 py-2 rounded-md"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
