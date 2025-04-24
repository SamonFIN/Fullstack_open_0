import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)
const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  if (all === 0) {
    return (
      <div>
        <h1> Statistics </h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (  
    <div>
      <h1> Statistics </h1>
      <table>
        <tbody>
          <StatisticsLine text='Good' value={good} />
          <StatisticsLine text='Neutral' value={neutral} />
          <StatisticsLine text='Bad' value={bad} />
          <StatisticsLine text='All' value={all} />
          <StatisticsLine text='Average' value={average} />
          <StatisticsLine text='Positive' value={positive + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1> Give feedback </h1>
      <Button handleClick={() => setGood(good + 1)} text='Good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='Neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='Bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App