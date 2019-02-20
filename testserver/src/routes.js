import Controller from './controller'
const cors = require('cors')
import EventStream from './eventStream.js'

const controller = new Controller()

export default (app) => {
  app.use(cors())

  app.route('/subscribe')
    .post(controller.subscribe.bind(controller))

  app.route('/subscriptions')
    .post(controller.getSubscriptions.bind(controller))

  app.route('/delete')
    .post(controller.deleteSubscription.bind(controller))

  app.route('/reaction')
    .post(controller.reaction.bind(controller))

  app.get('/sse', (req, res) => {
    EventStream.add(new EventStream(req, res, 'sse'))
  })
}