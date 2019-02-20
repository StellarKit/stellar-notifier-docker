<template>
<div class="hello">
  <div class='title'>{{ msg }}</div>

  <a
    href='http://localhost:8081/'
    target='__blank'
  >Mongo admin</a>
  <v-btn
    small
    outline
    @click='clickButton("status")'
  >Status</v-btn>
  <v-btn
    small
    outline
    @click='clickButton("version")'
  >
    Version
  </v-btn>

  <div class='section-box'>
    <div class='sb-title'>Subscriptions</div>
    <div class='subscribe-box'>
      <v-text-field
        v-model.trim="publicKey"
        label="Stellar public key"
        autofocus
        persistent-hint
        style='min-width: 550px;'
        placeholder='Public key'
        @keyup.enter='clickButton("subscribe")'
        hint='Enter public key of account you want to monitor.'
      />
      <v-btn
        small
        outline
        @click='clickButton("subscribe")'
      >
        Subscribe
      </v-btn>
    </div>

    <v-btn
      small
      outline
      @click='clickButton("get-subs")'
    >
      Get Subscriptions
    </v-btn>

    <div
      class='sub-holder'
      v-for="x in subscriptionArray"
      :key='x._id'
    >
      <div class='sub-holder-left'>
        account: {{x.account}}<br />
        id: {{x._id}}<br />
      </div>
      <div class='sub-holder-right'>
        <v-btn
          dark
          icon
          color='red'
          small
          @click='clickButton("delete", x._id)'
        >
          <v-icon>remove</v-icon>
        </v-btn>
      </div>
    </div>
  </div>

  <div class='section-box'>
    <div class='sb-title'>Events</div>
    <NotifierEvents :events='events' />
  </div>

  <Console :log='consoleOutput' />

</div>
</template>

<script>
import axios from 'axios'
import EventSource from 'eventsource'
import NotifierEvents from './NotifierEvents.vue'
import Console from './Console.vue'

export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: "stellar-notifier",
      consoleOutput: '',
      subscriptionArray: [],
      publicKey: 'GB572NB73ZJANPVZE2RPXR2WGFW4JXAUPIWMQSNF53ICKAQGTYFFH5LG',
      events: [],
      token: null
    }
  },
  components: {
    NotifierEvents,
    Console
  },
  mounted() {
    this.token = this.parseEnv('ADMIN_AUTHENTICATION_TOKEN')

    var es = new EventSource('http://localhost:8991/sse')
    es.addEventListener('event', (e) => {
      this.log('Event:')
      this.log(e.data, false)
      this.events.push(JSON.parse(e.data))

      // refresh subs only on some actions like subscribe
      // avoid an endless loop
      // this.clickButton('get-subs')
    })

    es.addEventListener('subscribe', (e) => {
      this.log('Subscribe:')
      this.log(e.data, false)

      this.clickButton('get-subs')
    })

    es.addEventListener('subscriptions', (e) => {
      const subs = JSON.parse(e.data)

      this.log('Subscriptions:')
      this.log(subs, false)

      this.subscriptionArray = subs
    })

    es.addEventListener('delete', (e) => {
      const data = JSON.parse(e.data)

      this.log('Delete:')
      this.log(data, false)

      this.clickButton('get-subs')
    })
  },
  methods: {
    parseEnv(key, defaultValue = null) {
      let value = process.env[key]
      if (value) {
        return value
      }

      return defaultValue
    },
    log(data, clear = true) {
      let newOutput = ''

      if (typeof data === 'string') {
        try {
          const parsedObj = JSON.parse(data)

          // get any objects?
          if (Object.keys(parsedObj).length === 0) {
            newOutput = data
          } else {
            newOutput = JSON.stringify(parsedObj, null, '  ')
          }
        } catch (err) {
          // not json
          newOutput = data
        }
      } else {
        newOutput = JSON.stringify(data, null, '  ')
      }

      newOutput += '\n\n'

      if (!clear) {
        this.consoleOutput += newOutput
      } else {
        this.consoleOutput = newOutput
      }
    },
    clickButton(id, param = null) {
      switch (id) {
        case 'delete':
          axios.post('http://localhost:8991/delete/', {
              subscriptionId: param
            })
            .then((response) => {
              this.log(response.data)
              this.clickButton('get-subs')
            })
            .catch((error) => {
              this.log(error)
            })
          break
        case 'status':
          axios.get('http://localhost:4021/api/status')
            .then((response) => {
              this.log(response.data)
            })
            .catch((error) => {
              this.log(error);
            })
          break
        case 'subscribe':
          axios.post('http://localhost:8991/subscribe', {
              publicKey: this.publicKey
            })
            .then((response) => {
              this.log(response.data)
            })
          break
        case 'version':
          axios.post('http://localhost:8991/version')
            .then((response) => {
              this.log(response.data)
            })
            .catch((error) => {
              this.log(error)
            })
          break

        case 'get-subs':
          axios.post('http://localhost:8991/subscriptions')
            .then((response) => {
              this.log(response.data)
            })
            .catch((error) => {
              this.log(error)
            })
          break
        default:
          this.log('switch failed')
          break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.hello {
    display: flex;
    flex-direction: column;
    align-items: center;

    a {
        margin: 12px;
    }

    .section-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        background: white;
        margin: 8px;
        padding: 20px;
        border: solid 1px rgba(0,0,0,.05);
        box-shadow: 0 7px 3px -5px rgba(0,0,0,.1);

        .sb-title {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 1em;
            color: rgba(0,130,130,.4);
        }
    }

    .subscribe-box {
        margin: 20px 0;
        padding: 20px;
        background: rgba(0,0,0,.05);
        border-radius: 8px;

    }

    .sub-holder {
        display: flex;
        background: rgba(0, 0,0, .05);
        padding: 10px;
        margin: 1px 0;
        font-size: 0.9em;

        .sub-holder-left {
            flex: 1 1 auto;
        }
        .sub-holder-right {
            padding-left: 10px;
        }
    }

    .title {
        font-size: 3em;
        text-transform: uppercase;
    }
}
</style>
