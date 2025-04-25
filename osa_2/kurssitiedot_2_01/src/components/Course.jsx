const Course = ({ course }) => {
  console.log(course)

  return (
    <div>
        <Header text={course.name} />
        <Content parts={course.parts} />
        <h3>total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</h3>
    </div>
  )
}

const Header = ({ text }) => {
  return <h2>{text}</h2>
}

const Part = ({ part }) => {
    return (
        <p>
        {part.name} {part.exercises}
        </p>
    )
    }

const Content = ({ parts }) => {
    return (
        <div>
        {parts.map(part => (
            <Part key={part.id} part={part} />
        ))}
        </div>
    )
}
export default Course