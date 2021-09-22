import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Home from '../containers/Home'
import Login from '../containers/Login'
import NotFound from '../../../components/NotFound'

// 注意，嵌套路由的Route不能加 exact,否则无法检测到子集
export const DashboardRouter = () => (
  <Router >
    <Switch>
      <Redirect exact to="/dashboard/login" from="/dashboard" />
      <Route exact path="/dashboard/login" component={Login} />
      <Route exact path="/dashboard/home" component={Home} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
)
