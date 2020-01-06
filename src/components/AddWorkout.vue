<template>
    <div class="add-workout">
        <p><input type="text" v-model="squats" placeholder="Squats"> <button @click="addWorkout">Add</button>
        </p>
    </div>
</template>

<script>
export default {
  name: 'AddWorkout',
  props: {
    msg: String
  },
  data() {
      return {
          squats: ""
      };
  },
  methods: {
    //   addWorkout: function() {
    //       this.workouts.push({
              
    //       });
    //       this.index = this.workouts.lentgth -1;
    //   }

    //   addNote() {
    //   this.notes.push({
    //     title: "",
    //     content: ""
    //   });
    //   this.index = this.notes.length - 1;
    // },
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
    input {
        margin: 10px 0;
        width: 20%;
        padding: 15px;
    }
    button {
        margin-top: 20px;
        width: 10%;
        cursor: pointer;
    }
</style>
