/**
 * 订阅消息需要手机运行httpserver 无法实现
 */

import ssdp from './libs/ssdp'
import event from './libs/event'
import control from './libs/control'

export default Object.assign(control, ssdp, event)
