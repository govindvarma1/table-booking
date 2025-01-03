import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="w-full px-6 py-4 shadow-md bg-blue-500 min-w-[350px] mb-4">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-xl text-white">Table Booking</h1>
				<button
					className="md:hidden text-white focus:outline-none"
					onClick={() => setIsOpen(!isOpen)}
				>
					<svg
						className="w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						{isOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16m-7 6h7"
							/>
						)}
					</svg>
				</button>
				<div className="hidden md:flex gap-4">
					<Link href="/" className="font-semibold text-white">
						Create Booking
					</Link>
					<Link href="/bookings" className="font-semibold text-white">
						View Booking
					</Link>
				</div>
			</div>
			{isOpen && (
				<div className="flex flex-col mt-2 space-y-2 md:hidden">
					<Link
						href="/"
						className="font-semibold text-white"
						onClick={() => setIsOpen(false)}
					>
						Create Booking
					</Link>
					<Link
						href="/bookings"
						className="font-semibold text-white"
						onClick={() => setIsOpen(false)}
					>
						View Booking
					</Link>
				</div>
			)}
		</nav>
	);
}
