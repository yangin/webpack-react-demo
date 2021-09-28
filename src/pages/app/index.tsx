import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter } from './configs/router'

const App = () => {
  return (
    <div className="index-container">
      <AppRouter />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
