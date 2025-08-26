import type { CoursePart } from "../App";
import Part from "./Part";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => (
  <div>
    {props.courseParts.map((part) => (
      <p key={part.name}>
        <strong>
          {part.name} {part.exerciseCount}
        </strong>
        <br />
        <Part part={part} />
      </p>
    ))}
  </div>
);

export default Content;
