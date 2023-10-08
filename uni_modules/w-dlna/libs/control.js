import net from './net'
const controll = {
  bind(device) {
    this.device = device
  },
  unBind() {
    this.device = null
  },
  async service(serviceName, actionName, params, soapActionName) {
    if (!this.device) {
      throw new Error("请先绑定设备")
    }
    if (!this.device?.urlBase || !this.device[serviceName].controlURL) {
      throw new Error("无效的URL")
    }
    const url = (this.device.urlBase + '/' + this.device[serviceName].controlURL).replace(/(\.*\d+)(\/\/)(\.*)/,
      '$1/$3')
    soapActionName = soapActionName || actionName
    const data = net.buildParams(serviceName, soapActionName, params)
    const header = net.buildHeader(serviceName, actionName, data.length)
   let r = await net.post(url, header, data)
   return r?.['s:Envelope']?.['s:Body']?.[`u:${actionName}Response`]
    
  },

  /**
   * 投屏控制
   * @param {Object} actionName
   * @param {Object} params
   */
  avTransportService(actionName, params, soapActionName) {
    
    const serviceName = 'AVTransport'
    return this.service(serviceName, actionName, params, soapActionName)
  },
  /**
   * 设备控制
   * @param {Object} actionName
   * @param {Object} params
   */
  renderingControl(actionName, params, soapActionName) {
    const serviceName = 'RenderingControl'
    return this.service(serviceName, actionName, params, soapActionName)
  },



  /**
   * @param {Object} CurrentURI '投屏的视频地址'
   * @param {Object} InstanceID '0'
   * @param {Object} CurrentURIMetaData '媒体描述信息 为空就行'
   * 投屏 
   */
  playUrl(CurrentURI, InstanceID, CurrentURIMetaData) {
    const params = {}
    params.InstanceID = InstanceID ? InstanceID : 0
    params.CurrentURI = CurrentURI
    params.CurrentURIMetaData = CurrentURIMetaData ? CurrentURIMetaData : ''
    //console.log("params: ",params);
    return this.avTransportService('SetAVTransportURI', params)
  },
  /**
   * @param {Object} Speed 播放速度 
   * @param {Object} InstanceID
   * 设置播放速度 为1 就可以。也可以倍速
   */
  play(Speed, InstanceID) {
    const params = {}
    params.InstanceID = InstanceID ? InstanceID : 0
    params.Speed = Speed == undefined ? 1 : Speed

    return this.avTransportService('Play', params)
  },
  /**
   * @param {Object} Speed
   * @param {Object} InstanceID
   * 暂停 设置Speed 为 0
   */
  pause(Speed, InstanceID) {
    return this.play(0)
  },
  /**
   * @param {Object} InstanceID InstanceID默认 0
   * 获取进度信息
   */
  getPositionInfo(InstanceID) {
    const params = {}
    params.InstanceID = InstanceID ? InstanceID : 0
    return this.avTransportService('GetPositionInfo', params)
  },
  /**
   * @param {Object} Target 格式 '00:00:00'
   * @param {Object} InstanceID默认 0
   * 进度跳转，
   */
  seek(Target, InstanceID) {
    const params = {
      Target
    }
    params.InstanceID = InstanceID ? InstanceID : 0
    params.Unit = 'REL_TIME'
    return this.avTransportService('Seek', params)
  },

  /**
   * 静音 好像没用
   * @param {Object} InstanceID
   * @param {Object} Channel
   */
  getMute(InstanceID, Channel) {
    const params = {}
    params.InstanceID = InstanceID ? InstanceID : 0
    params.Channel = Channel || 'Master'
    return this.renderingControl('GetMute', params)
  },

  /**
   * 设置静音  好像没用 
   * @param {Object} DesiredMute 是否静音
   * @param {Object} InstanceID
   * @param {Object} Channel
   */
  setMute(DesiredMute, InstanceID, Channel) {
    const params = {}
    params.InstanceID = InstanceID ? InstanceID : 0
    params.Channel = Channel || 'Master'
    params.DesiredMute = true
    return this.renderingControl('SetMute', params)
  },

  /**
   * 获取音量
   * @param {Object} InstanceID
   * @param {Object} Channel
   */
  getVolume(InstanceID, Channel) {
    const params = {}
    params.InstanceID = InstanceID ? InstanceID : 0
    params.Channel = Channel || 'Master'
    return this.renderingControl('GetVolume', params)
  },

  /**
   * 设置音量
   * @param {Object} InstanceID
   * @param {Object} Channel
   */
  setVolume(DesiredVolume, InstanceID, Channel) {
    const params = {}
    params.DesiredVolume = DesiredVolume || 0
    params.InstanceID = InstanceID ? InstanceID : 0
    params.Channel = Channel || 'Master'
    return this.renderingControl('SetVolume', params)
  }


}

export default controll
