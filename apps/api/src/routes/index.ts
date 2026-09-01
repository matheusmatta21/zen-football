import { Router } from "express";
import { getTeamMatchesController } from "../controllers/match";

const router = Router();

router.get("/matches", getTeamMatchesController);

export default router;