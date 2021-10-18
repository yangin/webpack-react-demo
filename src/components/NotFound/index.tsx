import React from 'react'
import { Button } from 'antd'
import { StyledNotFound } from './styles'

const NotFound = () => {
  const onGoBack = () => {
    console.log('这是NotFound按钮按钮')
  }

  return (
    <StyledNotFound>
      <div>
        <span>这是NotFound页</span>
      </div>
      <div>
        <Button type="primary" onClick={onGoBack}>返回</Button>
      </div>
    </StyledNotFound>
  )
}

export default NotFound
