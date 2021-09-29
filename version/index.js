;(async () => {
  try {
    const { default: axios } = require('axios')
    const { version: versionId, isForce } = require('../src/assets/config/version.json')
    const md5 = require('js-md5')
    const baseURL = 'http://81.68.189.158:10052/sokoban/app/v1/' // 正式环境
    // const baseURL = 'http://127.0.0.1:10052/api/' // 测试环境
    const authData = {
      name: '用户名',
      password: md5('密码')
    }
    let token = 'Bearer '
    {
      const {
        data: { data, code }
      } = await axios({
        url: `${baseURL}user/login`,
        method: 'POST',
        data: authData
      })
      if (code) throw Error('账号密码错误')
      token += data.token
    }
    {
      const {
        data: { code }
      } = await axios({
        headers: { Authorization: token },
        url: `${baseURL}version/add`,
        method: 'POST',
        data: { versionId, isForce }
      })
      if (code) throw Error('你没有权限发布版本')
      console.log('\x1B[32m%s\x1B[39m', `最新版本号v${versionId}发布成功`)
    }
  } catch (error) {
    console.log('\x1B[35m%s\x1B[39m', '发布失败')
    console.log('\x1B[35m%s\x1B[39m', '错误信息')
    console.log('\x1B[31m%s\x1B[39m', error)
  }
})()
