import React from 'react'

const Hello = (props) => {
  const name = props.props.name
  const age = props.props.age
  const bornYear = () => new Date().getFullYear() - age
  
  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were pobably born {bornYear()}</p>
    </div>
  )
}

const Footer = () => {
  return (
    <div>
      greeting app created by 
      <a href="https://github.com/SPitkanen"> SPitkanen</a>
    </div>
  )
}

const App = () => {
  const props = {
    name: 'Maya',
    age: 36
  }
  return (
    <>
      <h1>Greetings</h1>
      <Hello props={props}/>
      <Footer />
    </>
  )
}

export default App
