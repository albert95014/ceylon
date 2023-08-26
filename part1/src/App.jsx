import { useState } from 'react'

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text, value}) => {
  return (
    <div>
      {text} {value}
    </div>
  )
}

const Statistics = ({goodValue, neutralValue, badValue}) => {
  if (goodValue + neutralValue + badValue === 0) {
    return (
      <div>
        no feedback
      </div>
    )
  }
  return (
    <div>
      <p>good {goodValue}</p>
      <p>neutral {neutralValue}</p>
      <p>bad {badValue}</p>
      <p>total {goodValue + neutralValue + badValue}</p>
      <p>average {(goodValue*1 + (badValue*-1)) / (goodValue + neutralValue + badValue)}</p>
      <p>positive {(goodValue/(goodValue + neutralValue + badValue))+"%"}</p>
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