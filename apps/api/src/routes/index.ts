import { Router } from "express";
import { getTeamMatchesController } from "../controllers/match";
import { getTestMatchesController } from "../controllers/testMatch";

const router = Router();

router.get("/matches", getTeamMatchesController);
router.get("/test/matches", getTestMatchesController);

export default router;