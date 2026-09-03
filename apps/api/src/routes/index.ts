import { Router } from "express";
import {
  getCompetitionFromTeamController,
  getTeamMatchesController,
} from "../controllers/match";

const router = Router();

router.get("/matches", getTeamMatchesController);
router.get("/competitions", getCompetitionFromTeamController);

export default router;
