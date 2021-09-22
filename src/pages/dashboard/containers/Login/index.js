import React from 'react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import './styles.less'

const Login = (props) => {
  const onLogin = () => {
    props.history.push({ pathname: '/dashboard/home', params: 'yangjin' })
    console.log('这是登录按钮')
  }

  return (
    <div>
      <div>
        <span>Login Dashboard</span>
      </div>
      <div>
        <Button type="primary" onClick={onLogin}>登录</Button>
      </div>
    </div>
  )
}

export default withRouter(Login)
