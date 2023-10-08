/**
 * ssdp 发现服务
 */

import event from './event'
import net from './net'

//android 需要用到的包
let multicastSocket = plus.android.importClass("java.net.MulticastSocket");
let datagramPacket = plus.android.importClass("java.net.DatagramPacket");
let inetAddress = plus.android.importClass("java.net.InetAddress");
let javaString = plus.android.importClass("java.lang.String");

//ssdp广播的ip
const SSDP_IP = '239.255.255.250';
//ssdp广播的端口
const SSDP_PORT = 1900
//ssdp广播的host
const SSDP_HOST = SSDP_IP + ':' + SSDP_PORT
//ssdp 超时时间 15s
let TIMEOUT = 15000
//存放所有发现的SSDP设备
let deviceListAll = []
//过滤后的SSDP设备
let deviceList = []
let isSearch = false


//ssdp 发包数据
const SSDP_SEND_DATA = 
`HTTP/1.1 M-SEARCH
HOST: ${SSDP_HOST}
ST: ssdp:all
MAN: "ssdp:discover"
MX: 3
`

//ssdp发现任务启动的时间
let startTime = 0    

//接包缓存buffer
let buffer = new Array(1024).fill(0);

const ip = inetAddress.getByName(SSDP_IP)

const body = new javaString(SSDP_SEND_DATA)
//构造datagramPacket
const datagram_packet = datagramPacket(body.getBytes(), body.length(), SSDP_IP, SSDP_PORT);

/**
 * 设置搜索超时时间
 * @param {Object} time
 */
function setTimeOut(time){
  TIMEOUT = time
}

let multicast_socket = null 
/**
 * 发包
 */
function send(){
  if(multicast_socket){
    //先stop
    stop()
  }
  //设置发包数据
  multicast_socket = new multicastSocket(SSDP_PORT);
  multicast_socket.setLoopbackMode(false)
  multicast_socket.send(datagram_packet);
  multicast_socket.setSoTimeout(100)
  multicast_socket.joinGroup(ip)
}

/**
 * 循环接收数据，
 * 这玩意阻塞主线程造成页面卡死，
 * 临时用setTimeout解决
 */
function reveive(){
  if(multicast_socket){
    //接收数据包
    const buffer = new Array(1024).fill(0)
    const receive_packet = new datagramPacket(buffer, buffer.length)
    multicast_socket.receive(receive_packet)
    const receive_data = new javaString(receive_packet.getData()).trim()
    // 如果收到数据就解析
    if (receive_data.length != 0) {
      parseResult(receive_data)
    }  
    if (new Date().getTime() - startTime < TIMEOUT ) {
      //延时防止阻塞
      setTimeout(()=>{
        reveive()
      },10)
    } else {
      stop()
    }
  }
}

/**
 * 开始搜索
 */
function search(){
  if(isSearch) return 
  isSearch = true
  event.$emit('dlna-start')
  startTime = new Date().getTime()
  //清除所有缓存的
  deviceListAll = []
  deviceList = []
  //发包
  send()
  //循环接收
  reveive()
}


/**
 * 结束任务
 */
function stop() {
  isSearch = false
  event.$emit('dlna-stop')
  multicast_socket?.leaveGroup(ip)
  multicast_socket?.close()
  multicast_socket = null
} 

function parseResult(resp){
  //防止接收重复数据包
 
  let index = deviceListAll.findIndex(item => {
    return item == resp
  })
  //没有重复，处理数据包
  if (index == -1) {
    deviceListAll.push(resp)
    let lines = resp.toString().split("\r\n");
    let result = {}
    //数据包转object
    for (let line of lines) {
      line = line.replace(' * ', ' ')
      let item = line.split(" ");
      if(item?.[0]){
        var key = item[0]?.replace(':', '')?.toUpperCase()?.trim();
        var value = item[1]?.trim();
        result[key] = value
      }
    }
    //判断这个地址是否已经被找到，防止重复添加
    let ix = deviceList.findIndex(item => {
      return item.LOCATION == result.LOCATION
    })
    if (ix == -1 && result.NTS && result.NT && result.NTS.toUpperCase() == 'SSDP:ALIVE' && result.NT.toUpperCase()
      .indexOf(
        'SERVICE:AVTRANSPORT') != -1) {
       //找到新的设备，发送event
      //console.log('===========添加了============', result);
      net.getXml(result).then(res=>{
        event.$emit('dlna-find',res)
        deviceList.push(result)
      }).catch(e=>{
        console.error("getXml error: ",e);
      })
      
    }
  } else {
    return false
  }
}
export default {search, setTimeOut ,stop,isSearch}    
    