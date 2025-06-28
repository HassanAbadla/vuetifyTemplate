<template>
  <v-container>
    <h1>Arrays & Objects Methods</h1>
    <v-container>
      <v-row>
        <!-- Object Section -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Object Methods</v-card-title>

            <v-card-text>
              <h4>Current Object:</h4>
              <pre>{{ user }}</pre>

              <v-divider class="my-4"></v-divider>

              <h4>Add New Object:</h4>
              <v-text-field v-model="newUser.name" label="Name"></v-text-field>
              <v-text-field
                v-model="newUser.age"
                label="Age"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="newUser.email"
                label="Email"
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" @click="addObject">Add Object</v-btn>
              <v-btn color="secondary" @click="updateObject"
                >Update Object</v-btn
              >
              <v-btn color="error" @click="deleteObject">Delete Object</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Array Section -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Array Methods</v-card-title>

            <v-card-text>
              <h4>Current Array ({{ items.length }} items):</h4>
              <pre>{{ items }}</pre>

              <v-divider class="my-4"></v-divider>

              <h4>Add New Item:</h4>
              <v-text-field
                v-model="newItem.name"
                label="Item Name"
              ></v-text-field>
              <v-text-field
                v-model="newItem.value"
                label="Value"
                type="number"
              ></v-text-field>
            </v-card-text>

            <v-card-actions class="flex-wrap">
              <v-btn color="success" @click="pushArray">Push</v-btn>
              <v-btn color="warning" @click="popArray">Pop</v-btn>
              <v-btn color="info" @click="unshiftArray">Unshift</v-btn>
              <v-btn color="purple" @click="shiftArray">Shift</v-btn>
              <v-btn color="orange" @click="spliceArray">Splice</v-btn>
              <v-btn color="teal" @click="reverseArray">Reverse</v-btn>
              <v-btn color="indigo" @click="sortArray">Sort</v-btn>
              <v-btn color="error" @click="clearArray">Clear</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div></div>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        // Object example
        user: {
          name: "John Doe",
          age: 25,
          email: "john@example.com",
        },

        // Array example
        items: [
          { id: 1, name: "Item 1", value: 10 },
          { id: 2, name: "Item 2", value: 20 },
          { id: 3, name: "Item 3", value: 30 },
        ],

        // Forms
        newUser: {
          name: "",
          age: "",
          email: "",
        },

        newItem: {
          name: "",
          value: "",
        },
      }
    },

    methods: {
      // Object methods
      addObject() {
        // this.user = { ...this.newUser, age: Number(this.newUser.age) }
        this.user.name = this.newUser.name
        this.user.age = Number(this.newUser.age)
        this.user.email = this.newUser.email
        this.newUser = { name: "", age: "", email: "" }
      },

      updateObject() {
        this.user.name = "Updated Name"
        this.user.age = this.user.age + 1
        this.user.email = "updated@example"
      },

      deleteObject() {
        this.user = { name: "", age: 0, email: "" }
      },

      // Array methods
      pushArray() {
        const id = this.items.length + 1
        this.items.push({
          id: id,
          name: this.newItem.name,
          value: Number(this.newItem.value),
        })
        this.newItem = { name: "", value: "" }
      },

      popArray() {
        this.items.pop()
      },

      shiftArray() {
        this.items.shift()
      },

      unshiftArray() {
        this.items.unshift({
          id: 0,
          name: "First Item",
          value: 5,
        })
      },

      spliceArray() {
        this.items.splice(1, 1) // Remove item at index 1
      },

      reverseArray() {
        this.items.reverse()
      },

      sortArray() {
        this.items.sort((a, b) => a.value - b.value)
      },

      clearArray() {
        this.items = []
      },
    },
  }
</script>
<style scoped></style>
