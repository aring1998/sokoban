;(async () => {
  try {
    const { default: axios } = require('axios')
    const { version: versionId } = require('../src/assets/config/version.json')
    const md5 = require('js-md5')
    const baseURL = 'http://47.103.218.109:10052/api/'
    const authData = {
      name: 'admin',
      password: md5('123456')
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
        data: { versionId }
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
