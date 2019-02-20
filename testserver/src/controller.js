import EventStream from './eventStream.js'
import axios from 'axios'
import config from '../config.js'

export default class Controller {
  version(req, res) {
    res.json({
      message: '0.0.0.1.2.32'
    })
  }

  reaction(req, res) {
    EventStream.sendEvent('sse', 'event', req.body)
    res.json({
      message: req.body
    })
  }

  subscribe(req, res) {
    const account = req.body.publicKey
    const token = req.body.access_token

    axios.post(config.notifierURL() + '/api/subscription', {
        reaction_url: config.reactionURL(),
        access_token: token,
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