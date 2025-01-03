import { Router } from "express";
import {
	bookSlot,
	deleteSlot,
	getAllBookings,
	getAvailableSlots,
} from "../controllers/slot.controller.js";

const router = Router();

router.post("/bookSlot", bookSlot);
router.get("/getSlots", getAvailableSlots);
router.get("/getBookings", getAllBookings);
router.delete("/deleteSlot", deleteSlot);

export default router;
