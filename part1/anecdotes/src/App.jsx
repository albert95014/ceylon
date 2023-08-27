import { useState } from 'react'

const Button = ({text, handleClick}) => {
  return(
    <div>
      <button onClick={handleClick}>{text}</button>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length))
  const [mostPoints, setMostPoints] = useState(0)

  const chooseRandomAnecdote = () => {
    const randomNumber = Math.floor(Math.random()*anecdotes.length)
    setSelected(randomNumber)
  }

  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
    checkMostPoints(copy)
  }

  const checkMostPoints = (pointsArray) => {

    //spreading array treats each element in points as 1 argument
    // console.log(Math.max(...pointsArray))
    // console.log(pointsArray)

    const mostPointsIndex = pointsArray.indexOf(Math.max(...pointsArray))
    setMostPoints(mostPointsIndex)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p>has {points[selected]} points</p>
      <Button text="Vote" handleClick={vote} />
      <Button text="Randomize Anecdote" handleClick={chooseRandomAnecdote} />
      <h1>Anecdote with the most votes</h1>
      {anecdotes[mostPoints]}
      <p>has {points[mostPoints]} points</p>
    </div>
  )
}

export default App