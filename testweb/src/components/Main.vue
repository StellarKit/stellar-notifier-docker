<template>
<div class="hello">
  <img
    alt="Vue logo"
    height='200'
    width='200'
    src="../assets/logo.png"
  >

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

  <div class='section-box'>
    <div class='sb-title'>Subscriptions</div>
    <div class='subscribe-box'>
      <v-text-field
        v-model.trim="publicKey"
        label="Account (public key)"
        autofocus
        style='min-width: 550px;'
        placeholder='Public key'
        @keyup.enter='clickButton("subscribe")'
        hint='Enter public key of account you want to monitor.'
      />
      <v-text-field
        v-model.trim="memo"
        label="memo (optional)"
        placeholder='memo (optional)'
        @keyup.enter='clickButton("subscribe")'
        hint='Enter memo expected in transaction you want to monitor.'
      />
      <v-text-field
        v-model.trim="assetCode"
        label="asset code (optional)"
        placeholder='asset code (optional)'
        @keyup.enter='clickButton("subscribe")'
        hint='Enter asset code expected in transaction you want to monitor.'
      />
      <v-text-field
        v-model.trim="assetIssuer"
        label="asset issuer (optional)"
        placeholder='asset issuer (optional)'
        @keyup.enter='clickButton("subscribe")'
        hint='Enter asset issuer expected in transaction you want to monitor. Leave blank for XLM'
      />

      <v-autocomplete
        v-model="operationTypes"
        :disabled="isUpdating"
        :items="operations"
        small-chips
        color="blue-grey lighten-2"
        label="Operation Types"
        item-text="name"
        item-value="value"
        multiple
        dense
      >
        <template
          slot="selection"
          slot-scope="data"
        >
          <v-chip
            :selected="data.selected"
            close
            class="chip--select-multi"
            @input="remove(data.item)"
          >
            {{ data.item.name }}
          </v-chip>
        </template>
        <template
          slot="item"
          slot-scope="data"
        >
          <template v-if="typeof data.item !== 'object'">
            <v-list-tile-content v-text="data.item"></v-list-tile-content>
          </template>
          <template v-else>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-autocomplete>

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
import OperationTypes from './operationTypes.js'

export default {
  name: 'HelloWorld',
  data() {
    const srcs = {
      1: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      2: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      3: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
      4: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
      5: 'https://cdn.vuetifyjs.com/images/lists/5.jpg'
    }

    return {
      msg: "stellar-notifier",
      consoleOutput: '',
      subscriptionArray: [],
      publicKey: 'GB572NB73ZJANPVZE2RPXR2WGFW4JXAUPIWMQSNF53ICKAQGTYFFH5LG',
      memo: '',
      assetCode: '',
      assetIssuer: '',
      events: [],
      token: null,
      operationTypes: [1, 2, 5, 6, 7],
      isUpdating: false,
      operations: []
    }
  },
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    }
  },
  components: {
    NotifierEvents,
    Console
  },
  mounted() {
    for (let x = 0; x < 12; x++) {
      this.operations.push({
        name: OperationTypes.nameForType(x),
        value: x
      })
    }

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
    remove(item) {
      const index = this.operationTypes.indexOf(item.value)
      if (index >= 0) this.operationTypes.splice(index, 1)
    },
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
      const backend = 'http://localhost:8991'
      const notifier = 'http://localhost:4021'

      switch (id) {
        case 'delete':
          axios.post(backend + '/delete/', {
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
          axios.get(notifier + '/api/status')
            .then((response) => {
              this.log(response.data)
            })
            .catch((error) => {
              this.log(error);
            })
          break
        case 'subscribe':
          axios.post(backend + '/subscribe', {
              publicKey: this.publicKey,
              assetCode: this.assetCode,
              assetIssuer: this.assetIssuer,
              memo: this.memo,
              operationTypes: this.operationTypes
            })
            .then((response) => {
              this.log(response.data)
            })
          break
        case 'get-subs':
          axios.post(backend + '/subscriptions')
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
        display: flex;
        flex-direction: column;
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
