import type { CoursePart } from "../App";

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <span>
          <em>{part.description}</em>
        </span>
      );
    case "background":
      return (
        <span>
          <em>{part.description}</em>
          <br />
          background material: {part.backgroundMaterial}
        </span>
      );
    case "group":
      return <span>project exercises {part.groupProjectCount}</span>;
    case "special":
      return (
        <span>
          <em>{part.description}</em>
          <br />
          required skills:
          {part.requirements.map((r) => (
            <span key={r}>{" " + r}</span>
          ))}
        </span>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
