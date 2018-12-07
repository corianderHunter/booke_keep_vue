/**
 * 路由的具体配置
 */
import mainContainer from '@views/common/mainContainer'

/**
 * lazy load
 */
let timeline = () => import('@views/timeline')
let test = () => import('@views/test')
let recordForm = () => import('@views/record/form')
let recordCard = () => import('@views/record/card')

export default [{
  path: '/',
  name: 'main-container',
  component: mainContainer,
  redirect: 'timeline',
  children: [{
    path: 'timeline',
    name: 'timeline',
    component: timeline
  }, {
    path: 'test',
    name: 'test',
    component: test
  }, {
    path: 'record/form',
    name: 'recordForm',
    component: recordForm
  }, {
    path: 'record/card',
    name: 'recordCard',
    component: recordCard
  }]
}]
