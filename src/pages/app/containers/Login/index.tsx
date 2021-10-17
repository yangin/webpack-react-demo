import React from 'react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { StyledLogin } from './styles'

type LoginProps = {
  history: Object
}

const Login = (props: LoginProps) => {
  const { history } = props

  const onLogin = () => {
    history.push({ pathname: '/app/home', params: 'yangjin' })
    console.log('这是登录按钮')
  }

  return (
    <StyledLogin>
      <div>
        <span>Login</span>
      </div>
      <div>
        <Button type="primary" onClick={onLogin}>登录</Button>
      </div>
    </StyledLogin>
  )
}

export default withRouter(Login)
