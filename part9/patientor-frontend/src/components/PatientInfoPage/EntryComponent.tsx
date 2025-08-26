import { Entry, Diagnosis } from "../../types";
import { assertNever } from "../../helpers";

import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryComponent = ({ entry, diagnoses }: Props) => {
  const entryStyle = {
    borderStyle: "solid",
    borderRadius: "10px",
    borderWidth: "1px",
    paddingLeft: "20px",
    marginBottom: "20px",
  };

  const getEntryIcon = (): JSX.Element => {
    switch (entry.type) {
      case "HealthCheck":
        return <MedicalServicesIcon />;
      case "Hospital":
        return <LocalHospitalIcon />;
      case "OccupationalHealthcare":
        return (
          <span>
            <HealthAndSafetyIcon /> {entry.employerName}
          </span>
        );
      default:
        return assertNever(entry);
    }
  };

  const getHealthCheckRatingIcon = (): JSX.Element | null => {
    if (entry.type !== "HealthCheck") {
      return null;
    }

    const getHeartColor = () => {
      switch (entry.healthCheckRating) {
        case 0:
          return "green";
        case 1:
          return "yellow";
        case 2:
          return "orange";
        case 3:
          return "red";
        default:
          return "green";
      }
    };

    return (
      <p>
        <FavoriteIcon htmlColor={getHeartColor()} />
      </p>
    );
  };

  return (
    <div style={entryStyle}>
      <p>
        {entry.date} {getEntryIcon()}
      </p>
      <p>
        <i>{entry.description}</i>
      </p>
      {getHealthCheckRatingIcon()}
      <p>Diagnosed by {entry.specialist}</p>
      {entry.type === "Hospital" && (
        <p>
          Discharged at {entry.discharge.date} -{" "}
          <i>{entry.discharge.criteria}</i>
        </p>
      )}

      {entry.diagnosisCodes && (
        <div>
          Diagnoses:
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>
                {code} | {diagnoses.find((d) => d.code === code)?.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EntryComponent;
