import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full flex justify-between mb-4">
            <h1 className="font-bold text-2xl">Table Booking</h1>
            <div className="flex gap-2">
                <Link href='/' className="font-semibold">create booking</Link>
                <Link href='/bookings' className="font-semibold">view booking</Link>
            </div>
        </nav>
    )
}