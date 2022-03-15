import {updateConfig} from '@revgaming/helpers'

export default class {
  __secret = null
  cipher = null
  config = {
    key: 'token',
  }

  constructor(cipher, props = {}) {
    this.cipher = cipher
    updateConfig(this.config, props)
  }

  get secret() {
    if (!this.__secret) this.__secret = this.getSecret()
    return this.__secret
  }

  set secret(data) {
    if (typeof data !== 'object') throw 'input must be object'
    if (this.cipher.validate(data) !== true) throw 'data invalid'
    this.saveCredentials(this.cipher.encodeCredentials(data))
    this.__secret = data.secret
  }

  delete() {
    this.__secret = null
    this.removeToken()
  }

  getSecret() {
    const credentials = this.getCredentials()
    if (credentials) {
      const data = this.cipher.decodeCredentials(credentials)
      if (data) {
        if (this.cipher.validate(data) === true) return data.secret
        else {
          this.removeToken()
          return null
        }
      }
    }
  }

  getCredentials() {
    return localStorage.getItem(this.config.key)
  }

  saveCredentials(string) {
    localStorage.setItem(this.config.key, string)
  }

  removeToken() {
    localStorage.removeItem(this.config.key)
  }
}
