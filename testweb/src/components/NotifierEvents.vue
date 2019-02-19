<template>
<div class="events">

  <v-toolbar
    flat
    color="transparent"
  >
    <v-toolbar-title>Events</v-toolbar-title>
    <v-spacer></v-spacer>
    <div>Click for event record</div>
  </v-toolbar>
  <v-data-table
    :headers="headers"
    :items="events"
    item-key="id"
  >
    <template
      slot="items"
      slot-scope="props"
    >
      <tr @click="props.expanded = !props.expanded">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.operation.account }}</td>
        <td>{{ props.item.operation.type }}</td>
      </tr>
    </template>
    <template
      slot="expand"
      slot-scope="props"
    >
      <v-card flat>
        <textarea
          :value="expandedString(props.item)"
          readonly="readonly"
          wrap="off"
          class="output-container"
        />

        </v-card>
    </template>
  </v-data-table>

</div>
</template>


/*
  Event

  "id": "5c68c97254614800171f6744",
  "type": "operation",
  "created": "2019-02-17T02:39:46.553Z",
  "sent": "2019-02-17T02:39:46.585Z",
  "operation": {
    "type_i": 1,
    "type": "payment",
    "destination": "GARQ24RZUEMMATDLQXVA6LEDGG7MIQ74JU5CN4DIHXXS54QUFQWIAXY5",
    "asset": {
      "asset_type": 0
    },
    "amount": "10.0000000",
    "id": "9760244460691457",
    "account": "GB572NB73ZJANPVZE2RPXR2WGFW4JXAUPIWMQSNF53ICKAQGTYFFH5LG"
  },
  "transaction": {
    "hash": "9739d3d7ec2347b4889c22fbe54f7623dff35ad7e80a0e9db8376d90e43c6198",
    "fee": 100,
    "source": "GB572NB73ZJANPVZE2RPXR2WGFW4JXAUPIWMQSNF53ICKAQGTYFFH5LG",
    "paging_token": "9760244460691456",
    "source_account_sequence": "7979993401393232",
    "created_at": "2019-02-17T02:39:44Z"
  }
}
*/

<script>
export default {
  props: ['events'],
  data() {
    return {
      headers: [{
          text: 'ID',
          align: 'left',
          value: 'id'
        },
        {
          text: 'Account',
          value: 'account'
        },
        {
          text: 'Type',
          value: 'type'
        }
      ]
    }
  },
  methods: {
    expandedString(item) {
      return JSON.stringify(item, null, '  ')
    }
    // dd
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.events {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0,0,0,.05);
    margin: 10px 0;

    .output-container {
        width: 100%;
        height: 200px;
        resize: none;
        outline: none;
        font-size: 0.8em;
        font-family: monospace;
        overflow: auto;
    }

}
</style>
