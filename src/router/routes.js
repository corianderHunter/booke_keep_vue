/**
 * 路由的具体配置
 */
import mainContainer from '@views/common/mainContainer'

/**
 * lazy load
 */
let timeline = () => import('@views/timeline')
let test = () => import('@views/test')

export default [{
  path: '/',
  name: 'main-container',
  component: mainContainer,
  redirect: 'test',
  children: [{
    path: 'timeline',
    name: 'timeline',
    component: timeline
  }, {
    path: 'test',
    name: 'test',
    component: test
  }]
}]
