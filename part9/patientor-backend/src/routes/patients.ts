import express, { Request, Response, NextFunction } from "express";
import patientService from "../services/patient-service";
import { NewPatientSchema, NewEntrySchema } from "../utils";
import { z } from "zod";
import { NewPatient, Patient, Entry, NewEntry } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitivePatientInfo());
});

router.get("/:id", (req, res) => {
  res.send(patientService.getPatientById(req.params.id));
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post("/", newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  res.json(patientService.addPatient(req.body));
});

const entryParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post("/:id/entries", entryParser, (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>, next: NextFunction) => {
  try {
    res.send(patientService.addPatientEntry(req.params.id, req.body));
  } catch (error: unknown) {
    next(error);
  }
});

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else if (error instanceof Error && error.message === "Invalid ID") {
    res.status(400).send({ error: "Invalid patient ID" });
  } else {
    next(error);
  }
};

router.use(errorMiddleware);

export default router;