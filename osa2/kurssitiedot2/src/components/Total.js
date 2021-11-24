import React from 'react'

const Total = ({ parts }) => {
    const total = parts.reduce((prev, curr) => {
      return prev + curr.exercises
    }, 0)
    
    return (
      <div>
        <b>Total of {total} exercises</b>
      </div>
    )
}

export default Total