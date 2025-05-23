import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const Get_random_index = (lower_bound, upper_bound) => {
  const index = Math.floor(Math.random() * (upper_bound - lower_bound + 1)) + lower_bound
  console.log(index)
  return index
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(0)
  const num_anecdotes = anecdotes.length


  const updateVotes = () => {
    const copy = [...votes]
    copy[selected] += 1
    console.log(copy)
    setVotes(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <Button handleClick={() => {updateVotes()}} text="vote"/>
      <Button handleClick={() => setSelected(Get_random_index(0, num_anecdotes))} text="next anecdote"/>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[votes.indexOf(Math.max(...votes))]}</div>
      <div>has {Math.max(...votes)} votes</div>
    </div>
  )
}

export default App