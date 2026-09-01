import { Router } from "express";
import { getTeamMatchesController } from "../controllers/match";
import { getTestCompetitionFromTeamController, getTestMatchesController } from "../controllers/testMatch";

const router = Router();

router.get("/matches", getTeamMatchesController);
router.get("/test/matches", getTestMatchesController);
router.get("/test/competitions", getTestCompetitionFromTeamController);

export default router;