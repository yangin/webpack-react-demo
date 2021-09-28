import React from 'react'
import { Button } from 'antd'
import './styles.less'

const NotFound = () => {
  const onGoBack = () => {
    console.log('这是NotFound按钮按钮')
  }

  return (
    <div>
      <div className="container">
        <span>这是NotFound页</span>
      </div>
      <div>
        <Button type="primary" onClick={onGoBack}>返回</Button>
      </div>
    </div>
  )
}

export default NotFound
