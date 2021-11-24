import React, { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0])
  const [mostPoints, setMostPoints] = useState([0, 0])

  const select = () => {
    const max = (anecdotes.length - 1)
    const rnd = Math.floor(Math.random() * max)
    setSelected(rnd)
  }

  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    if (mostPoints[1] < copy[selected]) {
      const copyMostPoints = [...mostPoints]
      copyMostPoints[0] = selected
      copyMostPoints[1] = copy[selected]
      setMostPoints(copyMostPoints)
    }
    setPoints(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>Has {points[selected]} votes</p>
      <Button handleClick={vote} text='Vote'/>
      <Button handleClick={select} text='Next anecdote'/>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostPoints[0]]}</p>
      <p>Has {points[mostPoints[0]]} votes</p>
    </div>
  )
}

export default App
