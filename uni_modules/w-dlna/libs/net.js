/**
 * 网络请求
 * 使用uni.request
 * 可统一处理请求失败问题
 */
//import xml2js from './xml2js'
// const { XMLParser} = require("fast-xml-parser");
import {XMLParser} from '@/node_modules/fast-xml-parser'
/**Z
 * 获取页面的描述
 * @param {Object} ssdp
 */
const parser = new XMLParser();
function getXml(ssdp) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: ssdp.LOCATION,
      success: (res) => {
        try{
          
          const data =  parser.parse(res.data); 
          const services = data.root.device.serviceList.service
          const result = {
            ip:ssdp.LOCATION.replace(/.*?\/\/(.*?):.*/, '$1'),
            port:ssdp.LOCATION.replace(/.*?:(\d+).*/, '$1'),
            name:data.root.device?.friendlyName,
            urlBase:data.root.URLBase,
            AVTransport:services?.filter(item=>{
              return item.serviceType.indexOf('AVTransport')!==-1
            })?.[0],
            RenderingControl:services?.filter(item=>{
              return item.serviceType.indexOf('RenderingControl')!==-1
            })?.[0],
            ConnectionManager:services?.filter(item=>{
              return item.serviceType.indexOf('ConnectionManager')!==-1
            })?.[0],
          }
          resolve(result)
        }catch(e){
          reject("解析xml失败")
        }
      },
      fail: (e) => {
        reject(e)
      },
    })
  })

}


/**
 * @param {Object} actionName
 * 构造请求头的方法
 */
function buildHeader(serviceName, soapActionName, length) {
  return {
    "Content-Type": 'text/xml; charset="utf-8"',
    "SOAPACTION": `"urn:schemas-upnp-org:service:${serviceName}:1#${soapActionName}"`,
    "Content-Length": length.toString(),
    'user-agent': ''
  }
}
/**
 * @param {Object} actionName
 * @param {Object} params
 * 构造请求数，请params参数转为xml
 */
function buildParams(serviceName, actionName, params) {
  let param = ''
  for (let key in params) {
    param += `<${key}>${params[key]}</${key}>\n`
  }
  const body = `<?xml version="1.0" encoding="utf-8" standalone="no"?>
<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"
    xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
        <u:${actionName} xmlns:u="urn:schemas-upnp-org:service:${serviceName}:1">
          ${param}
        </u:${actionName}>
    </s:Body>
</s:Envelope>`
  return body.trim()
}
/**
 * 发送数据包
 * @param {Object} actionName
 * @param {Object} options
 * @param {Object} url
 */
function post(url, header, data) {
  if (!url) throw new Error("please bind first")
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: "POST",
      header: header,
      data: data,
      success: (res) => {
        let result =  parser.parse(res.data); 
        const fault = result?.['s:Envelope']?.['s:Body']?.['s:Fault']
        if(fault){
          return reject(fault?.['detail']?.['UPnPError']?.['errorDescription'] || "error")
        }
        resolve(result)
      },
      fail: (e) => {
        reject(e)
      },
    })
  })
}
export default {
  getXml,
  post,
  buildParams,
  buildHeader
}
