/**
 * 路由的具体配置
 */
import mainContainer from '@views/common/mainContainer'

/**
 * lazy load
 */
let timeline = () => import('@views/timeline')

export default [{
  path: '/',
  name: 'main-container',
  component: mainContainer,
  redirect: 'timeline',
  children: [{
    path: 'timeline',
    name: 'timeline',
    component: timeline
  }]
}]
