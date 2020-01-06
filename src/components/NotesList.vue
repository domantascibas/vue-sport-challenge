<template>
    <div class="list">
        <input type="number" v-model="this.newReps" placeholder="reps">
        <button @click="addWorkout()" class="btn btn-info">+ Workout</button>
        <ul class="list-group">
            <li class="list-group-item"
                v-for="(workout, index) in workouts"
                :key="workout.index"
                @click="changeNote(index)"
                >
                <!-- :class="{ 'active': index === activeNote}" -->
                <p>{{ workout.time.toLocaleString('default', {month: 'short'})}} {{ workout.time.getDate() }} - <b>{{ workout.reps }}</b> reps</p>
            </li>
        </ul>
    </div>
</template>
 
<script>
// var Weekday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
// var Month = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

export default {
  name: "NoteList",
  props: ["workouts", "activeNote", "newReps"],
  data: function() {
      return {
          reps: this.newReps
      }
  },
  methods: {
    changeNote(index) {
      this.$emit("app-changeNote", index);
    },
    addWorkout() {
      this.$emit("app-addWorkout");
    }
  }
};
</script>
 
<style>
.list {
  margin: 20px;
}
ul {
  list-style-type: none;
}
li {    
    display: block;
}
</style>
