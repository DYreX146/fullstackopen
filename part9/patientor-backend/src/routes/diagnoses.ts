import express from "express";
import diagnosisService from "../services/diagnosis-service";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(diagnosisService.getDiagnoses());
});

router.post("/", (_req, res) => {
  res.send("Adding diagnosis...");
});

export default router;