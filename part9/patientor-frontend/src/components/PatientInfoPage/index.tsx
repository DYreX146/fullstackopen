import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Diagnosis, Patient, EntryFormValues } from "../../types";
import { Button, Alert } from "@mui/material";

import EntryComponent from "./EntryComponent";
import AddEntryForm from "./AddEntryForm";

import patientService from "../../services/patients";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientInfoPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [entryFormOpen, setEntryFormOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const id = useParams().id;

  useEffect(() => {
    const getPatient = async () => {
      if (!id) {
        return <p>No ID provided</p>;
      }

      const patient = await patientService.getById(id);
      setPatient(patient);
    };
    void getPatient();
  }, [id]);

  const closeEntryForm = (): void => {
    setEntryFormOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if (id && patient) {
        const entry = await patientService.createEntry(id, values);

        const newPatient: Patient = {
          ...patient,
          entries: patient.entries.concat(entry),
        };

        setPatient(newPatient);
        setEntryFormOpen(false);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else if (
          e?.response?.data &&
          Array.isArray(e?.response?.data.error)
        ) {
          const message = e.response.data.error[0].message;
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
      setTimeout(() => setError(undefined), 5000);
    }
  };

  if (!patient) {
    return <p>Patient not found</p>;
  }

  const getGenderIcon = () => {
    switch (patient.gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      default:
        return <QuestionMarkIcon />;
    }
  };

  return (
    <div>
      <h2>
        {patient.name} {getGenderIcon()}
      </h2>
      <p>
        SSN: {patient.ssn}
        <br />
        Occupation: {patient.occupation}
      </p>

      {error && <Alert severity="error">{error}</Alert>}

      {!entryFormOpen && (
        <Button onClick={() => setEntryFormOpen(true)} variant="contained">
          Add Entry
        </Button>
      )}

      {entryFormOpen && (
        <AddEntryForm
          onCancel={closeEntryForm}
          onSubmit={submitNewEntry}
          diagnoses={diagnoses}
        ></AddEntryForm>
      )}

      <h3>Entries</h3>
      {patient.entries.map((entry) => (
        <EntryComponent key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientInfoPage;
