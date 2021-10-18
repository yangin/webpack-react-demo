import React, { lazy } from 'react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { CHARTS_OPTIONS } from '../../constants'
import { StyledHome } from './styles'

const ReactEcharts = lazy(() => import('echarts-for-react'))

type HomeProps = {
  history: Object
}

const Home = (props: HomeProps) => {
  const { history } = props

  const onGoBack = () => {
    history.push({ pathname: '/notfound', params: 'yangjin' })
    console.log('这是返回按钮按钮')
  }

  return (
    <StyledHome>
      <div>
        <span>这是Home页</span>
      </div>
      <div className='echart-container'>
        <ReactEcharts option={CHARTS_OPTIONS} />
      </div>
      <div>
        <Button type="primary" onClick={onGoBack}>返回</Button>
      </div>
    </StyledHome>
  )
}

export default withRouter(Home)
