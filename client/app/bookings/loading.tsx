import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BookingsSkeleton() {
	return (
		<div className="px-16 py-2 max-[450px]:px-4">
			{/* Skeleton for Heading */}
			<Skeleton height={25} width="15%" className="mb-4" />

			{/* Skeleton for Tabs */}
			<div className="flex gap-4 mb-4">
				<Skeleton height={20} width={80} />
				<Skeleton height={20} width={80} />
			</div>

			{/* Skeleton for Booking List */}
			<div>
				<h3 className="text-xl font-semibold mb-2">
					<Skeleton width={100} />
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{Array(4)
						.fill(0)
						.map((_, index) => (
							<div
								key={index}
								className="p-4 border border-gray-200 rounded-lg"
							>
								<Skeleton width="80%" height={20} />
								<Skeleton width="60%" height={20} className="mt-2" />
								<Skeleton width="50%" height={20} className="mt-2" />
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
