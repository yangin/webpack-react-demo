import React from 'react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { StyledDashboardLogin } from './styles'

type LoginProps = {
  history: Object
}

const Login = (props: LoginProps) => {
  const { history } = props

  const onLogin = () => {
    history.push({ pathname: '/dashboard/home', params: 'yangjin' })
    console.log('这是登录按钮')
  }

  return (
    <StyledDashboardLogin>
      <div>
        <span>Login Dashboard</span>
      </div>
      <div>
        <Button type="primary" onClick={onLogin}>登录</Button>
      </div>
    </StyledDashboardLogin>
  )
}

export default withRouter(Login)
