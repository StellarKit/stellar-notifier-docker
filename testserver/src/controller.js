import EventStream from './eventStream.js'
import axios from 'axios'
import config from '../config.js'

export default class Controller {
  constructor() {
    this.token = this.parseEnv('ADMIN_AUTHENTICATION_TOKEN', '')
  }

  version(req, res) {
    res.json({
      message: '0.0.0.1.2.32'
    })
  }

  parseEnv(key, defaultValue = null) {
    const value = process.env[key]
    if (value) {
      return value
    }

    return defaultValue
  }

  reaction(req, res) {
    EventStream.sendEvent('sse', 'event', req.body)
    res.json({
      message: req.body
    })
  }

  deleteSubscription(req, res) {
    const subscriptionId = req.body.subscriptionId

    const options = {}
    if (this.token && this.token.length > 0) {
      options.headers = {
        'authorization': 'Token ' + this.token
      }
    }

    axios.delete(config.notifierURL() + '/api/subscription/' + subscriptionId, options)
      .then((response) => {
        EventStream.sendEvent('sse', 'delete', response.data)
      })
      .catch((error) => {
        console.log(error)
      })

    res.json({
      message: 'delete OK'
    })
  }

  getSubscriptions(req, res) {
    const options = {}
    if (this.token && this.token.length > 0) {
      options.headers = {
        'authorization': 'Token ' + this.token
      }
    }

    axios.get(config.notifierURL() + '/api/subscription', options)
      .then((response) => {
        EventStream.sendEvent('sse', 'subscriptions', response.data)
      })
      .catch((error) => {
        console.log(error)
      })

    res.json({
      message: 'subscriptions OK'
    })
  }

  subscribe(req, res) {
    const account = req.body.publicKey
    // const token = req.body.access_token

    axios.post(config.notifierURL() + '/api/subscription', {
        reaction_url: config.reactionURL(),
        access_token: this.token,
        account: account,
        operation_types: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      })
      .then(function(response) {
        EventStream.sendEvent('sse', 'subscribe', req.body)

        console.log('Subscribe successful')
      })
      .catch(function(error) {
        console.log(error)
      })

    res.json({
      message: 'subscribe OK'
    })
  }
}