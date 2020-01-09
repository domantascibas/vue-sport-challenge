<template>
<div id="home">
    <b-container class="body">
        <b-row>
            <b-col cols="12" md="6">
                <article class="card mb-2" style="max-width: 30rem;">
                    <!-- <img src="../assets/KneeCrunches1.png" alt="" class="card-img-top"> -->

                    <div class="card-body">

                    <b-card-text>
                        <h1>{{ repcount }} / {{ goal }}</h1>
                        <b-progress :value="repcount" :max="goal" animated></b-progress>
                        <div class="rep-input">
                            <b-input-group class="mt-3">
                                <b-form-input type="number" v-model="newReps" :placeholder="units"></b-form-input>
                                <b-input-group-append>
                                    <b-button @click="addWorkout()" variant="info">+ Add</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                        <p>Keep going {{ name }}!</p>
                        <p>You need {{ Math.floor((goal - repcount) / days_left)}} {{units}}/day to reach your goal!</p>
                        <p>Days left: {{ days_left }}</p>
                        <p>Reps left: {{ goal - repcount }}</p>
                    <!-- Some quick example text to build on the card title and make up the bulk of the card's content. -->
                    </b-card-text>
                    </div>



                </article>
            </b-col>
            <b-col cols="12" md="6">
                <div class="list">
                    <h3>Leaderboard</h3>
                    <b-list-group class="list-group">
                        <b-list-group-item v-for="participant  in participants" :key="participant.index">
                            <p><span v-if="participant.id === uid">&diams; </span><b>{{ participant.reps }} / {{ goal }}</b> {{ participant.name }}<span v-if="participant.id === uid"> &diams;</span></p>
                        </b-list-group-item>
                    </b-list-group>
                </div>
                <div>
                    <h4 v-if="name === ''">Profile</h4>
                    <div v-if="name === ''"><p>Name: <input type="text" :placeholder="name" v-model="name"></p></div>
                    <button v-if="name === ''" @click="updateProfile">Save</button> <button @click="logout()" class="btn btn-info">Logout</button>
                </div>
            </b-col>

            <!-- <div class="list">
                <h3>History</h3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(workout, index) in myWorkouts"
                        :key="workout.index"
                        @click="changeNote(index)">
                        <p>{{ workout.time.toLocaleString('default', {month: 'short'})}} {{ workout.time.getDate() }} - <b>{{ workout.reps }}</b> reps</p>
                    </b-list-group-item>
                </b-list-group>
            </div> -->
        </b-row>

    </b-container>
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
        myWorkouts: [],
        index: 0,
        repcount: 0,
        goal: 0,
        newReps: '',
        name: '',
        uid: '',
        units: 'none',
        challenge_start: 0,
        challenge_end: 0,
        days_left: 0,
        participants: [],
        users: []
    }),
    methods: {
        logout: function() {
            firebase.auth().signOut().then(() => {
                this.$router.replace('login')
            })
        },
        // changeNote(index) {
        //     index = 0;
        //     // console.log(index)
        // },
        addWorkout() {
            if (this.newReps == "" || this.newReps == 0) {
                alert("Enter number of reps")
            } else {
                var now = new Date();
                this.workouts.unshift({
                    reps: this.newReps,
                    time: now,
                    user: firebase.auth().currentUser.uid,
                });
                this.newReps = ""
                this.index = 0
                this.repcount += parseInt(this.workouts[this.index].reps)
                fb.db.collection("challenges").doc("knee-crunches-jan").collection("workouts").add(this.workouts[this.index])
                // console.log(this.repcount)
            }
        },
        updateProfile() {
            var user = firebase.auth().currentUser;

            user.updateProfile({
                displayName: this.name,
                // photoURL: "https://example.com/jane-q-user/profile.jpg"
                }).then(function() {
                // Update successful.
                    // console.log("succes. profile saved")
                    // console.log(user.displayName)
                }).catch(function(error) {
                // An error happened.
                    alert("error. profile not updated " + error.message)
            });
        }
        // removeNote() {
            //     const id = this.notes[this.index].id;
        //     fb.notesRef.child(id).remove();
        // }
    },
    created() {
        var id = firebase.auth().currentUser.uid;
        var myWorkoutsRef = fb.db.collection("challenges").doc("knee-crunches-jan").collection("workouts").where("user", "==", id).orderBy("time", "desc");
        var workoutsRef = fb.db.collection("challenges").doc("knee-crunches-jan").collection("workouts");
        var challengeRef = fb.db.collection("challenges").doc("knee-crunches-jan");
        var usersRef = fb.db.collection("users");

        workoutsRef.get().then((doc) => {
            doc.forEach((doc) => {
                if (doc.exists) {
                    this.workouts.push({
                        reps: parseInt(doc.data().reps),
                        user: doc.data().user
                    })
                }
            });
        });

        usersRef.get().then((doc) => {
            doc.forEach((doc) => {
                if (doc.exists) {
                    this.users.push({
                        id: doc.id,
                        name: doc.data().name
                    })
                }
            });
        });

        myWorkoutsRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.myWorkouts.push({
                    id: doc.id,
                    time: doc.data().time.toDate(),
                    reps: parseInt(doc.data().reps)
                });
            });

            // for (var i in this.myWorkouts) {
            //     this.repcount += parseInt(this.myWorkouts[i].reps)
            // }
        });

        challengeRef.get().then((doc) => {
            if (doc.exists) {
                this.units = doc.data().units
                this.goal = parseInt(doc.data().goal)
                this.challenge_start = doc.data().start_date.toDate()
                this.challenge_end = doc.data().end_date.toDate()
                this.days_left = Math.floor((this.challenge_end - this.challenge_start) / (24 * 60 * 60 * 1000))
                var p = doc.data().participants
                // console.log(p)
                for (var i in p) {
                    for (var j in this.users) {
                        var repCount = 0
                        if (this.users[j].id == p[i]) {
                            for (var w in this.workouts) {
                                if (this.workouts[w].user == p[i]) {
                                    repCount += this.workouts[w].reps
                                }
                            }
                            this.participants.push({
                                id: p[i],
                                name: this.users[j].name,
                                reps: repCount
                            })
                            if (p[i] == firebase.auth().currentUser.uid) {
                                this.repcount = repCount
                            }
                        }
                    }
                }
                this.participants.sort((a, b) => (a.name < b.name) ? 1 : -1).sort((a, b) => (a.reps < b.reps) ? 1 : -1)
                // for (var k in this.participants) {
                //     console.log(this.participants[k].id, this.participants[k].name, this.participants[k].reps)
                // }
            }
        });

        var user = firebase.auth().currentUser;

        if (user != null) {
            this.name = user.displayName;
            this.uid = user.uid;
            // email = user.email;
            // photoUrl = user.photoURL;
            // emailVerified = user.emailVerified;
            // uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                            // this value to authenticate with your backend server, if
                            // you have one. Use User.getToken() instead.
        }

        // console.log(this.name)
        // console.log(email)
        // console.log(photoUrl)
        // console.log(emailVerified)
        // console.log(uid)

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
#home {
    background: url("../assets/KneeCrunches1.png") no-repeat center center fixed;;
    background-size: cover;
    min-height: 100%;
    width: 100%;
    left: 0;
}
.body {
    padding-top: 100px;
    padding-bottom: 60px;
    left: 0;
    right: 0;
}
article.card {
    background: rgb(240, 248, 255, 0.73);
}
.rep-input {
    margin: 10px 0 40px;
}
.list {
    margin: 20px;
}
.list-group .list-group-item {
    background: rgb(240, 248, 255, 0.73);
}

</style>
