import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import 'antd/dist/antd.less'
import './index.less'

const App = () => {
  return (
    <div className="index-container">
      <div>
        <span>Hello React Hot</span>
      </div>
      <div>
        <Button type="primary">Click</Button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
