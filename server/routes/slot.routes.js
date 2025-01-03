import { Router } from "express"
import { bookSlot, getAvailableSlots } from "../controllers/slot.controller.js";

const router = Router();

router.post('/bookSlot', bookSlot);
router.get('/getSlots', getAvailableSlots);

export default router;