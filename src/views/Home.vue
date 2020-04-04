<template>
<div id="home">
    <b-container class="body">
        <b-row>
            <b-col cols="12" md="6">
                <article class="card mb-2" style="max-width: 30rem;">
                    <!-- <img src="../assets/KneeCrunches1.png" alt="" class="card-img-top"> -->

                    <div class="card-body">
                        <b-card-text>
                            <h1>{{ user_workout_data.total_result }} / {{ challenge_info.goal }}</h1>
                            <b-progress :value="user_workout_data.total_result" :max="challenge_info.goal" animated></b-progress>
                            <div class="rep-input">
                                <b-input-group class="mt-3">
                                    <!-- <b-form-input type="number" v-model="newReps" :placeholder="units"></b-form-input> -->
                                    <b-input-group-append>
                                        <b-button @click="addWorkout()" variant="info">+ Add</b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </div>
                            <p>Keep going {{ user_info.name }}!</p>
                            <!-- <p v-if="hasEndDate">You need {{ Math.floor((goal - repcount) / days_left)}} {{units}}/day to reach your goal!</p> -->
                            <!-- <p v-if="hasEndDate">Days left: {{ days_left }}</p> -->
                            <!-- <p v-if="unit_configurable">{{ units }} left: {{ ((goal - repcount) / (step_size / 100)).toFixed(2) }}</p> -->
                            <!-- <p v-else>{{ units }} left: {{ goal - repcount }}</p> -->

                            <div class="step-size-input">
                                <b-input-group class="mt-3">
                                    <b-col cols="4">
                                        <p >Step size ({{ settings_info.step_size_units }}):</p>
                                    </b-col>
                                    <b-col cols="4">
                                        <b-form-input type="number" placeholder="cm" v-model="settings_info.step_size"></b-form-input>
                                    </b-col>
                                    <b-col cols="4">
                                        <b-input-group-append>
                                            <b-button @click="saveSettings()" variant="info">Save</b-button>
                                        </b-input-group-append>
                                    </b-col>
                                </b-input-group>
                            </div>
                        <!-- Some quick example text to build on the card title and make up the bulk of the card's content. -->

                        </b-card-text>
                    </div>
                </article>
            </b-col>

            <b-col cols="12" md="6">
                <div class="list">
                    <h3>Leaderboard</h3>
                    <b-list-group class="list-group">
                        <b-list-group-item v-for="participant in participants" :key="participant.index">
                            <p><span v-if="participant.id === user_info.id">&diams; </span><b>{{ participant.result }} / {{ challenge_info.goal }}</b> {{ participant.name }}<span v-if="participant.id === user_info.id"> &diams;</span></p>
                        </b-list-group-item>
                    </b-list-group>
                </div>
                <!-- <div>
                    <h4 v-if="name === ''">Profile</h4>
                    <div v-if="name === ''"><p>Name: <input type="text" :placeholder="name" v-model="name"></p></div>
                    <button v-if="name === ''" @click="updateProfile">Save</button> <button @click="logout()" class="btn btn-info">Logout</button>
                </div> -->
            </b-col>
        </b-row>

    </b-container>
</div>
</template>

<script>
import firebase from 'firebase'
// @ is an alias to /src
// import NotesList from '@/components/NotesList.vue'

const fb = require('@/main.js')

// const MM_IN_CM = 10
// const CM_IN_METER = 100
// const MM_IN_METER = 1000

const CHALLENGES = "challenges"
const PARTICIPANTS = "participants"
const TYPES = "types"
const USERS = "users"
const SETTINGS = "settings"
// const WORKOUTS = "workouts"

export default {
    name: 'home',
    components: {
        // NotesList,
    },
    data: () => ({
        selected_challenge: "ZpmOZVpv2YJsI9e8ZpvJ",
        participants: [],

        challenge_info: {
            name: "New Challenge",
            start_date: 0,
            end_date: 0,
            goal: 0,
            has_end_date: false,
            has_ended: true,
            is_private: true,
            type: "None",
            units: 0,
        },
        
        type_info: {
            name: "Default type",
            available_units: [],    // steps / meters
            step_size_units: [],    // mm / cm / m
        },

        settings_info: {
            // other available settings are retrieved from type info
            units: 0,               // selection from available units: steps / meters
            step_size_units: 0,     // selection from available units: mm / cm / m
            step_size: 0
        },

        workout_info: {
            date: 0,
            step_size: 0,
            steps: 0,
            tot_climb: 0
        },

        user_info: {
            name: "User",
            id: "userID"
        },

        user_workout_data: {
            total_result: 0,
            last_workout: 0,
            biggest_workout: 0
        }

        // workouts: [],
        // myWorkouts: [],
        // index: 0,
        // repcount: 0,
        // goal: 0,
        // newReps: '',
        // name: '',
        // uid: '',
        // units: 'none',
        // unit_configurable: false,
        // step_size: CM_IN_METER,
        // type: 'none',
        // challenge_start: 0,
        // challenge_end: 0,
        // hasEndDate: 0,
        // days_left: 0,
        // participants: [],
        // users: [],
        // types: []
    }),
    methods: {
        logout: function() {
            firebase.auth().signOut().then(() => {
                this.$router.replace('login')
            })
        },

        print_data() {
            console.log('')
            console.log('Challenge Info')
            console.log('Name          :', this.challenge_info.name)
            console.log('Start         :', this.challenge_info.start_date)
            console.log('End           :', this.challenge_info.end_date)
            console.log('Goal          :', this.challenge_info.goal)
            console.log('Type          :', this.challenge_info.type)
            console.log('Units         :', this.challenge_info.units)
            console.log('has end date  :', this.challenge_info.has_end_date)
            console.log('has ended     :', this.challenge_info.has_ended)
            console.log('is private    :', this.challenge_info.is_private)
        },

        print_participants() {
            console.log('')
            console.log('Participants')
            for (var p in this.participants) {
                console.log('#'+p)
                console.log('Name       :', this.participants[p].name)
                console.log('ID         :', this.participants[p].id)
                console.log('Result     :', this.participants[p].result)
                console.log('is admin   :', this.participants[p].is_admin)
                console.log('is visible :', this.participants[p].is_visible)
            }
        },

        print_type_data() {
            console.log('')
            console.log('Type info')
            console.log('Name               :', this.type_info.name)
            console.log('Available Units')
            for (var i in this.type_info.available_units) {
                console.log('Size unit          :', this.type_info.available_units[i])
            }
            console.log('Available Step Size Units')
            for (var j in this.type_info.step_size_units) {
                console.log('Step size unit     :', this.type_info.step_size_units[j])
            }
        },

        print_user_settings() {
            console.log('')
            console.log('User Settings')
            console.log('Units              :', this.settings_info.units)
            console.log('Step Size Units    :', this.settings_info.step_size_units)
            console.log('Step Size          :', this.settings_info.step_size)
        },

        print_user_data() {
            console.log('')
            console.log('User Info')
            console.log('Name               :', this.user_info.name)
            console.log('ID                 :', this.user_info.id)
            console.log('Total Result       :', this.user_info.total_result)
            console.log('Last Workout       :', this.user_info.last_workout)
            console.log('Biggest Workout    :', this.user_info.biggest_workout)
        },

        get_user_data() {
            var user = firebase.auth().currentUser;

            if (user != null) {
                this.user_info.name = user.displayName;
                this.user_info.id = user.uid;
                // email = user.email;
                // photoUrl = user.photoURL;
                // emailVerified = user.emailVerified;
                // uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                                // this value to authenticate with your backend server, if
                                // you have one. Use User.getToken() instead.
            }

            var userResultsDataRef = fb.db.collection(USERS).doc(this.user_info.id).collection(CHALLENGES).doc(this.selected_challenge)
            userResultsDataRef.get().then((doc) => {
                if (doc.exists) {
                    this.user_workout_data = doc.data()
                }
                this.print_user_data()
            });
        },

        get_challenge_data() {
            var challengeDataRef = fb.db.collection(CHALLENGES).doc(this.selected_challenge)
            challengeDataRef.get().then((doc) =>{
                if (doc.exists) {
                    this.challenge_info = doc.data()
                    this.get_type_data()
                }
                this.print_data()
            });
        },

        get_type_data() {
            var typeDataRef = fb.db.collection(TYPES).doc(this.challenge_info.type)
            typeDataRef.get().then((doc) => {
                if (doc.exists) {
                    this.type_info = doc.data()
                }
                this.print_type_data()
            });
        },

        get_participant_data() {
            var participantsRef = fb.db.collection(CHALLENGES).doc(this.selected_challenge).collection(PARTICIPANTS)
            participantsRef.get().then((doc) => {
                doc.forEach((doc) => {
                    if (doc.exists) {
                        var new_participant = doc.data()
                        new_participant.id = doc.id
                        this.participants.push(new_participant)
                    }
                })
                this.sort_leaderboard()
                this.print_participants()
            });
        },

        get_user_settings() {
            var userSettingsRef = fb.db.collection(USERS).doc(this.user_info.id).collection(SETTINGS).doc(this.selected_challenge)
            userSettingsRef.get().then((doc) => {
                if (doc.exists) {
                    this.settings_info = doc.data()
                }
                this.print_user_settings()
            });
        },

        sort_leaderboard() {
            this.participants.sort((a, b) => (a.name < b.name) ? 1 : -1).sort((a, b) => (a.result < b.result) ? 1 : -1)
        }

            // challengeRef.get().then((doc) => {
                //     if (doc.exists) {
                    //         this.type = doc.data().type
        //         this.goal = parseInt(doc.data().goal)
        //         this.hasEndDate = doc.data().hasEndDate
        //         this.challenge_start = doc.data().start_date.toDate()
        //         this.challenge_end = doc.data().end_date.toDate()
        //         var today = new Date()
        //         this.days_left = Math.floor((this.challenge_end - today) / (24 * 60 * 60 * 1000))
                
        //         var p = doc.data().participants
        //         // console.log(p)
                
        //         for (var t in this.types) {
        //             if (this.types[t].id == this.type) {
        //                 this.units = this.types[t].units
        //                 if (this.types[t].unit_configurable) {
        //                     this.unit_configurable = this.types[t].unit_configurable
        //                 }
        //             }
        //         }

        //         for (var i in p) {
        //             for (var j in this.users) {
        //                 var repCount = 0
        //                 if (this.users[j].id == p[i]) {
        //                     for (var w in this.workouts) {
        //                         if (this.workouts[w].user == p[i]) {
        //                             repCount += this.workouts[w].reps
        //                         }
        //                     }
        //                     this.participants.push({
        //                         id: p[i],
        //                         name: this.users[j].name,
        //                         reps: repCount
        //                     })
        //                     if (p[i] == firebase.auth().currentUser.uid) {
        //                         this.repcount = repCount
        //                     }
        //                 }
        //             }
        //         }
        //         this.participants.sort((a, b) => (a.name < b.name) ? 1 : -1).sort((a, b) => (a.reps < b.reps) ? 1 : -1)
        //         // for (var k in this.participants) {
        //         //     console.log(this.participants[k].id, this.participants[k].name, this.participants[k].reps)
        //         // }
        //     }
        // });

        // saveSettings() {
        //     if (this.step_size == "" || this.step_size ==0) {
        //         alert("Step size can't be zero!")
        //     } else {
        //         fb.db.collection('users').doc(this.uid).update({'step_size': this.step_size})
        //     }
        // },

        // addWorkout() {
        //     if (this.newReps == "" || this.newReps == 0) {
        //         alert("Enter number of " + this.units)
        //     } else {
        //         // var now = new Date();
        //         if (this.unit_configurable) {
        //             this.newReps = this.newReps * this.step_size / CM_IN_METER
        //             // console.log(this.newReps)
        //         }

        //         var newEntry = {
        //             reps: this.newReps,
        //             time: new Date(),
        //             user: this.uid,
        //             step_size: parseInt(this.step_size)
        //         }

        //         this.workouts.unshift(newEntry)
                
        //         this.newReps = ""
        //         this.index = 0
        //         this.repcount += this.workouts[this.index].reps
        //         // console.log(this.workouts[this.index].reps)
                
        //         var that = this
        //         fb.db.collection("challenges").doc(this.currChallenge).collection("workouts")
        //         .add(this.workouts[this.index])
        //         .then(function(docRef) {
        //             newEntry.id = docRef.id
        //             that.myWorkouts.unshift(newEntry)
        //             // console.log("Document written with ID: ", newEntry.id)
        //             that.updateLeadeboard()
        //         })

        //     }
        // },

        // removeWorkout(index) {
        //     this.repcount -= this.myWorkouts[index].reps
        //     this.updateLeadeboard()
        //     fb.db.collection("challenges").doc(this.currChallenge).collection("workouts").doc(this.myWorkouts[index].id).delete()
        //     this.myWorkouts.splice(index, 1)
        // },

        // updateProfile() {
        //     var user = firebase.auth().currentUser;

        //     user.updateProfile({
        //         displayName: this.name,
        //         // photoURL: "https://example.com/jane-q-user/profile.jpg"
        //         }).then(function() {
        //         // Update successful.
        //             // console.log("succes. profile saved")
        //             // console.log(user.displayName)
        //         }).catch(function(error) {
        //         // An error happened.
        //             alert("error. profile not updated " + error.message)
        //     });
        // },

        // updateLeadeboard() {
        //     for (var part in this.participants) {
        //         if (this.participants[part].id == this.uid) {
        //             this.participants[part].reps = this.repcount
        //         }
        //     }
        //     this.participants.sort((a, b) => (a.name < b.name) ? 1 : -1).sort((a, b) => (a.reps < b.reps) ? 1 : -1)
        // },
    },
    
    created() {
        // Retrieve user data:
        this.get_user_data()
        this.get_user_settings()
        // Retrieve challenge info:
        this.get_challenge_data()
        this.get_participant_data()

        // var id = firebase.auth().currentUser.uid;
        // var myWorkoutsRef = fb.db.collection("challenges").doc(this.currChallenge).collection("workouts").where("user", "==", id).orderBy("time", "desc");
        // var workoutsRef = fb.db.collection("challenges").doc(this.currChallenge).collection("workouts");
        // var challengeRef = fb.db.collection("challenges").doc(this.currChallenge);
        // var challengeTypeRef = fb.db.collection("type");
        // var usersRef = fb.db.collection("users");

        // workoutsRef.get().then((doc) => {
        //     doc.forEach((doc) => {
        //         if (doc.exists) {
        //             this.workouts.push({
        //                 reps: doc.data().reps,
        //                 user: doc.data().user,
        //                 step_size: doc.data().step_size
        //             })
        //             // console.log(doc.data())
        //         }
        //     });
        // });

        // usersRef.get().then((doc) => {
        //     doc.forEach((doc) => {
        //         if (doc.exists) {
        //             this.users.push({
        //                 id: doc.id,
        //                 name: doc.data().name,
        //                 step_size: doc.data().step_size
        //             })

        //             if (doc.id == this.uid) {
        //                 if (doc.data().step_size != null) {
        //                     this.step_size = doc.data().step_size
        //                 }
        //             }
        //         }
        //     });
        // });

        // myWorkoutsRef.get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         this.myWorkouts.push({
        //             id: doc.id,
        //             time: doc.data().time.toDate(),
        //             reps: doc.data().reps,
        //             step_size: doc.data().step_size
        //         });
        //     });

        //     // for (var i in this.myWorkouts) {
        //         //     this.repcount += parseInt(this.myWorkouts[i].reps)
        //     // }
        // });

        // challengeTypeRef.get().then((doc) => {
        //     doc.forEach((doc) => {
        //         if (doc.exists) {
        //             this.types.push({
        //                 id: doc.id,
        //                 display_name: doc.data().display_name,
        //                 name: doc.data().name,
        //                 unit_configurable: doc.data().unit_configurable,
        //                 units: doc.data().units,
        //             })
        //             // console.log(this.types[0].id, this.types[0].name)
        //         }
        //     });
        // });

        // 

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
    background: url("../assets/vertical-climb.jpg") no-repeat center center fixed;
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
    background: rgb(240, 248, 255, 0.8);
}
.rep-input {
    margin: 10px 0 40px;
}
.list {
    margin: 20px;
}
.list-group .list-group-item {
    background: rgb(240, 248, 255, 0.8);
}
svg.bi-trash-fill:hover {
    cursor: pointer;
}

</style>
