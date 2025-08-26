import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { Patient, NonSensitivePatientInfo, NewPatient, Entry, NewEntry } from "../types";

const getPatients = (): Patient[] => patients;

const getPatientById = (id: string): Patient | undefined => patients.find(patient => patient.id === id);

const getNonSensitivePatientInfo = (): NonSensitivePatientInfo[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuid(),
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const addPatientEntry = (id: string, entry: NewEntry): Entry => {
  const patient = getPatientById(id);

  if (!patient) {
    throw new Error("Invalid ID");
  }

  const newEntry = {
    ...entry,
    id: uuid()
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatientById,
  getNonSensitivePatientInfo,
  addPatient,
  addPatientEntry
};