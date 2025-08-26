import { useState, SyntheticEvent } from "react";
import { TextField, InputLabel, MenuItem, Select, Button } from "@mui/material";
import {
  HealthCheckRating,
  EntryFormValues,
  EntryType,
  Diagnosis,
} from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onSubmit, onCancel, diagnoses }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const getEntryValues = (): EntryFormValues => {
      switch (type) {
        case "HealthCheck":
          return {
            type: "HealthCheck",
            description,
            date,
            specialist,
            healthCheckRating,
          };
        case "OccupationalHealthcare":
          const values: EntryFormValues = {
            type: "OccupationalHealthcare",
            description,
            date,
            specialist,
            employerName,
          };

          if (sickLeaveStartDate && sickLeaveEndDate) {
            values.sickLeave = {
              startDate: sickLeaveStartDate,
              endDate: sickLeaveEndDate,
            };
          }

          return values;

        case "Hospital":
          return {
            type: "Hospital",
            description,
            date,
            specialist,
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria,
            },
          };
      }
    };

    const newValues = getEntryValues();

    if (diagnosisCodes.length) {
      newValues.diagnosisCodes = diagnosisCodes;
    }

    onSubmit(newValues);
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <InputLabel style={{ marginTop: 20 }}>Type</InputLabel>
        <Select
          label="Type"
          fullWidth
          value={type}
          onChange={({ target }) => setType(target.value as EntryType)}
        >
          <MenuItem value={"HealthCheck"}>Health Check</MenuItem>
          <MenuItem value={"OccupationalHealthcare"}>
            Occupational Healthcare
          </MenuItem>
          <MenuItem value={"Hospital"}>Hospital</MenuItem>
        </Select>

        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          style={{ marginTop: 20 }}
        />

        <TextField
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          style={{ marginTop: 20 }}
        />

        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          style={{ marginTop: 20 }}
        />

        {type === "HealthCheck" && (
          <div>
            <InputLabel style={{ marginTop: 20 }}>
              Healthcheck Rating
            </InputLabel>
            <Select
              label="Healthcheck Rating"
              fullWidth
              value={healthCheckRating.toString()}
              onChange={({ target }) =>
                setHealthCheckRating(Number(target.value))
              }
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>
                Critical Risk
              </MenuItem>
            </Select>
          </div>
        )}

        {type === "OccupationalHealthcare" && (
          <div>
            <TextField
              label="Employer"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              style={{ marginTop: 20 }}
            />

            <InputLabel style={{ marginTop: 20 }}>Sick Leave</InputLabel>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              style={{ marginTop: 10 }}
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
              style={{ marginTop: 10 }}
            />
          </div>
        )}

        {type === "Hospital" && (
          <div>
            <InputLabel style={{ marginTop: 20 }}>Discharge Info</InputLabel>
            <TextField
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              style={{ marginTop: 10 }}
            />
            <TextField
              label="Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              style={{ marginTop: 10 }}
            />
          </div>
        )}

        <InputLabel style={{ marginTop: 20 }}>Diagnosis Codes</InputLabel>
        <Select
          label="Diagnosis Codes"
          fullWidth
          multiple
          value={diagnosisCodes}
          onChange={({ target }) =>
            setDiagnosisCodes(
              typeof target.value === "string"
                ? target.value.split(",")
                : target.value
            )
          }
        >
          {diagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.name}
            </MenuItem>
          ))}
        </Select>

        <Button
          color="secondary"
          variant="contained"
          type="button"
          onClick={onCancel}
          style={{ marginTop: 20 }}
        >
          Cancel
        </Button>

        <Button
          style={{
            float: "right",
            marginTop: 20,
          }}
          type="submit"
          variant="contained"
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddEntryForm;
