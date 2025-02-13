const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
  <div>
    {props.parts.map(part => <Part part={part} key={part.id} />)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p><strong>total of {props.total} exercises</strong></p>

const Course = (props) => (
  <div>
    <Header course={props.course.name} />
    <Content parts={props.course.parts} />
    <Total total={props.course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
  </div>
)

export default Course