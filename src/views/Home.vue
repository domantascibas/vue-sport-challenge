<template>
  <div class="home">
    <!-- <LeaderBoard msg="Squat ch allenge"/>
    <AddWorkout msg="Add Workout"/> -->
    <div id="app">
        <!-- <h3>Hi, {{ name }}</h3> -->
        <h1>{{ repcount }}</h1>
        <!-- <NotesList 
          @app-addWorkout="addWorkout"
          @app-changeNote="changeNote"
          :workouts="workouts"
          :activeNote="index"
          :newReps="newReps"
        /> -->
        <div class="list">
            <input type="number" v-model="newReps" placeholder="reps">
            <button @click="addWorkout()" class="btn btn-info">+ Workout</button>
            <ul class="list-group">
                <li class="list-group-item"
                    v-for="(workout, index) in workouts"
                    :key="workout.index"
                    @click="changeNote(index)"
                    >
                    <p>{{ workout.time.toLocaleString('default', {month: 'short'})}} {{ workout.time.getDate() }} - <b>{{ workout.reps }}</b> reps</p>
                </li>
            </ul>
        </div>
    </div>
    <!-- <button @click="test">test</button> -->
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase'
// @ is an alias to /src
// import NotesList from '@/components/NotesList.vue'

const fb = require('@/main.js')

export default {
    name: 'home',
    components: {
        // NotesList,
    },
    data: () => ({
        workouts: [],
        index: 0,
        repcount: 0,
        newReps: '',
        name: ''
    }),
    methods: {
        logout: function() {
            firebase.auth().signOut().then(() => {
                this.$router.replace('login')
            })
        },
        // test() {
        //     fb.db.collection("users").add({
        //         first: "Alan",
        //         middle: "Mathison",
        //         last: "Turing",
        //         born: 1912
        //     })
        //     .then(function(docRef) {
        //         console.log("Document written with ID: ", docRef.id);
        //     })
        //     .catch(function(error) {
        //         console.error("Error adding document: ", error);
        //     });
        // },
        addWorkout() {
            var now = new Date();
            this.workouts.unshift({
                reps: this.newReps,
                type: "dHzMqPCfpSJJCBEBpJf8",
                time: now,
                user: firebase.auth().currentUser.uid,
            });
            this.newReps = '';
            this.index = this.workouts.length - 1;
            this.repcount += parseInt(this.workouts[this.index].reps)
            fb.db.collection("workouts").add(this.workouts[this.index])
            console.log(this.repcount)
        },
        // removeNote() {
        //     const id = this.notes[this.index].id;
        //     fb.notesRef.child(id).remove();
        // }
    },
    created() {
        var id = firebase.auth().currentUser.uid;
        var workoutsRef = fb.db.collection("workouts").where("user", "==", id).orderBy("time", "desc")

        // this.name = 

        workoutsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.workouts.push({
                    id: doc.id,
                    time: doc.data().time.toDate(),
                    reps: parseInt(doc.data().reps)
                });
                // console.log(`${doc.id} => ${doc.data().reps}`);
            });

            for (var i in this.workouts) {
                this.repcount += parseInt(this.workouts[i].reps)
                console.log(this.workouts[i].id)
                console.log(this.workouts[i].time)
            }
            console.log(this.repcount)
        });

    // /* eslint-disable no-console */
    // // value = snapshot.val() | id = snapshot.key
    // fb.notesRef.on("child_added", snapshot => {
    //   console.log("note was added: ", { ...snapshot.val(), id: snapshot.key });
    // });
 
    // fb.notesRef.on("child_removed", snapshot => {
    //   const deletedNote = this.notes.find(note => note.id === snapshot.key);
    //   console.log("note was removed: ", deletedNote);
 
    //   const index = this.notes.indexOf(deletedNote);
    //   this.notes.splice(index, 1);
    //   this.index = this.index === 0 ? 0 : index - 1;
    // });
 
    // fb.notesRef.on("child_changed", snapshot => {
    //   const updatedNote = this.notes.find(note => note.id === snapshot.key);
    //   updatedNote.title = snapshot.val().title;
    //   updatedNote.content = snapshot.val().content;
    //   console.log("note was updated: ", updatedNote);
    // });
    /* eslint-enable no-console */
  }
}
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
