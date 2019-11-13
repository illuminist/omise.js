/**
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * Omise.js Core
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */
import { isUri } from 'valid-url'
import 'whatwg-fetch'

export default class Omise {
  constructor(config) {
    const result = verifyConfigStructure(config)
    if (result.error) {
      throw new Error(result.message)
    }

    this.config = config
    this.publicKey = null
    this._rpc = null
  }

  _createRpc(callback) {
    if (this._rpc) {
      return this._rpc
    } else {
      const { vaultUrl } = this.config
      const tm = setTimeout(() => {
        this._rpc.destroy()
        this._rpc = null

        if (callback) {
          callback()
        }
      }, 30000)

      this._rpc = new easyXDM.Rpc(
        {
          remote: `${vaultUrl}/provider`,
          onReady() {
            clearTimeout(tm)
          },
        },
        {
          remote: {
            createToken: {},
          },
        }
      )

      return this._rpc
    }
  }

  setPublicKey(publicKey) {
    this.publicKey = publicKey
    return this.publicKey
  }

  createSource(type, options, callback) {
    const auth = btoa(this.publicKey)

    options.type = type

    const url = `${this.config.interfaceUrl}/sources/`
    return fetch(url, {
      method: 'post',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })
      .then(response => Promise.all([response, response.json()]))
      .then(([response, data]) => {
        if (callback)
          callback(response.status, data)
        else
          return [response.status, data]
      })
      .catch(e => {
        if (callback)
          callback(0, {
            code: 'create_source_error',
            error: e.message,
          })
          return
        const error = new Error(e.message)
        error.code = e.code
        throw error
      })
  }

  // createToken(type, options, callback) {
  //   const auth = btoa(this.publicKey)

  //   options.type = type

  //   const url = `${this.config.vaultUrl}/tokens/`
  //   return fetch(url, {
  //     method: 'post',
  //     credentials: 'include',
  //     headers: {
  //       Authorization: `Basic ${auth}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(options),
  //   })
  //     .then(response => Promise.all([response, response.json()]))
  //     .then(([response, data]) => {
  //       if (callback)
  //         callback(response.status, data)
  //       else
  //         return [response.status, data]
  //     })
  //     .catch(e => {
  //       if (callback)
  //         callback(0, {
  //           code: 'create_source_error',
  //           error: e.message,
  //         })
  //         return
  //       const error = new Error(e.message)
  //       error.code = e.code
  //       throw error
  //     })
  // }

  createToken(as, attributes, handler) {
    const data = {}
    data[as] = attributes

    const promise = new Promise((resolve, reject) =>{
      this._createRpc(() => {
        reject([0, {
          code: 'rpc_error',
          message: 'unable to connect to provider after timeout',
        }])
      }).createToken(
        this.publicKey,
        data,
        response => {
          resolve([response.status, response.data])
        },
        e => {
          reject([e.data.status, e.data.data])
        }
      )
    })
    .then(d => {
      if(handler) {
        handler(...d)
      } else {
        return d
      }
    })
    .catch(e => {
      if(handler) {
        handler(...e)
      } else {
        const error = new Error(e[1])
        error.code = e[0]
        throw error
      }
    })
    if (!handler) return promise
  }
}

/**
 * Helper to verify config structure.
 * @param {Object} config - config for omise.js.
 */
export function verifyConfigStructure(config) {
  const result = {
    error: false,
    message: '',
  }

  if (!config.vaultUrl || !isUri(config.vaultUrl)) {
    result.message = 'Missing valutUrl'
  } else if (!config.cardHost || !isUri(config.cardHost)) {
    result.message = 'Missing cardHost'
  } else if (!config.interfaceUrl || !isUri(config.interfaceUrl)) {
    result.message = 'Missing interfaceUrl'
  }

  result.error = result.message !== ''

  return result
}
