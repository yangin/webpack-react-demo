import React from 'react'
import ReactDOM from 'react-dom'
import { DashboardRouter } from './configs/router'

const App = () => {
  return (
    <div>
      <DashboardRouter/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('dashboard'))
