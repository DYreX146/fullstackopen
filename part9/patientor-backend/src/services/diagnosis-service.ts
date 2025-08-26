import diagnoses from "../../data/diagnoses";
import { Diagnosis } from "../types";

const getDiagnoses = (): Diagnosis[] => diagnoses;

const addDiagnosis = () => null;

export default {
  getDiagnoses,
  addDiagnosis
};