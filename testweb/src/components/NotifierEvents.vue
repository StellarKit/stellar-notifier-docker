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
