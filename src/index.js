import React from 'react';
import ReactDOM from 'react-dom';
import './index.less'

const App = () => {
  return (
    <div className="index-container">
      <span>Hello React</span>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
