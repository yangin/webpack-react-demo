// import loadable from '@loadable/component'
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { CHARTS_OPTIONS } from '../../constants'
import { StyledDashboardHome } from './styles'

type HomeProps = {
  history: Object
}

const Home = (props: HomeProps) => {
  const { history } = props

  const onGoBack = () => {
    history.push({ pathname: 'dashboard/notfound', params: 'yangjin' })
    console.log('这是返回按钮按钮')
  }

  return (
    <StyledDashboardHome>
      <div>
        <span>这是Dashboard Home页</span>
      </div>
      <div className='dashboard-echart-container'>
        <ReactEcharts option={CHARTS_OPTIONS} />
      </div>
      <div>
        <Button type="primary" onClick={onGoBack}>返回</Button>
      </div>
    </StyledDashboardHome>
  )
}

export default withRouter(Home)
