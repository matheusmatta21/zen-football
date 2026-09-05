import { Router } from "express";
import {
  getCompetitionFromTeamController,
  getTeamMatchesController,
} from "../controllers/match";
import { getTeamsFromCompetitionController } from "../controllers/teams";
import { getClubsController } from "../controllers/clubs";

const router = Router();

router.get("/matches", getTeamMatchesController);
router.get("/competitions", getCompetitionFromTeamController);
router.get("/teams", getTeamsFromCompetitionController);
router.get("/clubs", getClubsController);

export default router;
