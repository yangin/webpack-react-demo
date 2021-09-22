import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { CHARTS_OPTIONS } from '../../constants'
import './styles.less'

const Home = (props) => {
  const onGoBack = () => {
    props.history.push({ pathname: '/notfound', params: 'yangjin' })
    console.log('这是返回按钮按钮')
  }

  return (
    <div>
      <div>
        <span>这是Home页</span>
      </div>
      <div className='echart-container'>
        <ReactEcharts option={CHARTS_OPTIONS} />
      </div>
      <div>
        <Button type="primary" onClick={onGoBack}>返回</Button>
      </div>
    </div>
  )
}

export default withRouter(Home)
