import { useState } from 'react'

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text, value}) => {
  return (
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      </tbody>
  )
}

const Statistics = ({goodValue, neutralValue, badValue}) => {
  if (goodValue + neutralValue + badValue === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <table>
        <StatisticLine text="good" value={goodValue} />
        <StatisticLine text="neutral" value={neutralValue} />
        <StatisticLine text="bad" value={badValue} />
        <StatisticLine text="total" value={goodValue + neutralValue + badValue} />
        <StatisticLine text="average" value={(goodValue*1 + (badValue*-1)) / (goodValue + neutralValue + badValue)} />
        <StatisticLine text="positive" value={(goodValue/(goodValue + neutralValue + badValue))+"%"} />
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(good + neutral + bad)

  const handleGoodFeedback = () => {
    const newGood = good+1
    setGood(good+1)
    setTotal(newGood+neutral+bad)
  }

  const handleNeutralFeedback = () => {
    const newNeutral = neutral+1
    setNeutral(neutral+1)
    setTotal(good+newNeutral+bad)
  }

  const handleBadFeedback = () => {
    const newBad = bad+1
    setBad(bad+1)
    setTotal(good+neutral+newBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodFeedback} text="good" />
      <Button handleClick={handleNeutralFeedback} text="neutral" />
      <Button handleClick={handleBadFeedback} text="bad" />

      <h1>statistics</h1>
      <Statistics goodValue={good} neutralValue={neutral} badValue={bad} />
    </div>
  )
}

export default App