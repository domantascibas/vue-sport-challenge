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
                                    <b-form-input type="number" v-model="new_workout_entry" :placeholder="settings_info.units == 0 ? 'steps' : 'meters'"></b-form-input>
                                    <!-- :placeholder="settings_info.step_size_units" -->
                                    <b-input-group-append>
                                        <b-button @click="addWorkout()" variant="info">+ Add</b-button>
                                    </b-input-group-append>
                                </b-input-group>
                            </div>
                            <p>Keep going {{ user_info.name }}!</p>
                            <!-- <p v-if="hasEndDate">You need {{ Math.floor((goal - repcount) / days_left)}} {{units}}/day to reach your goal!</p> -->
                            <!-- <p v-if="hasEndDate">Days left: {{ days_left }}</p> -->
                            <!-- <p v-if="unit_configurable">{{ units }} left: {{ ((goal - repcount) / (step_size / 100)).toFixed(2) }}</p> -->
                            <p>{{ settings_info.units == 0 ? 'steps' : 'meters' }} left: {{ settings_info.units == 1 ? challenge_info.goal - user_workout_data.total_result : settings_info.step_size_units == 0 ? ((challenge_info.goal - user_workout_data.total_result) * 1000 / settings_info.step_size).toFixed(2) : settings_info.step_size_units == 1 ? ((challenge_info.goal - user_workout_data.total_result) * 100 / settings_info.step_size).toFixed(2) : ((challenge_info.goal - user_workout_data.total_result) / settings_info.step_size).toFixed(2) }}</p>

                            <div class="step-size-input">
                                <b-input-group class="mt-3">
                                    <b-col cols="4">
                                        <p >Step size ({{ settings_info.step_size_units == 0 ? 'mm' : settings_info.step_size_units == 1 ? 'cm' : 'm' }}):</p>
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

                        </b-card-text>
                    </div>
                </article>
            </b-col>

            <b-col cols="12" md="6">
                <div class="list">
                    <h3>Leaderboard</h3>
                    <b-list-group class="list-group">
                        <b-list-group-item v-for="participant in participants" :key="participant.index">
                            <p><span v-if="participant.id === user_info.id">&diams; </span><b>{{ participant.total_result }} / {{ challenge_info.goal }}</b> {{ participant.name }}<span v-if="participant.id === user_info.id"> &diams;</span></p>
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

        <b-row>
            <b-col cols="12" md="5" class="list">
                <h3>History</h3>
                <b-list-group>
                    <b-list-group-item
                        v-for="(workout, index) in workouts"
                        :key="workout.index">
                        <p>{{ workout.date.toLocaleString('default', {month: 'short'})}} {{ workout.date.getDate() }} - <b>{{ workout.entry }} {{ challenge_info.units ? 'meters' : 'steps' }}:</b> {{ workout.steps }} * {{ workout.step_size }} {{ workout.step_size_units == 0 ? 'mm' : workout.step_size_units == 1 ? 'cm' : 'm' }}
                            <svg class="bi bi-trash-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" @click="removeWorkout(index)">
                            <path fill-rule="evenodd" d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1H3v9a2 2 0 002 2h6a2 2 0 002-2V4h.5a1 1 0 001-1V2a1 1 0 00-1-1H10a1 1 0 00-1-1H7a1 1 0 00-1 1H2.5zm3 4a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zM8 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7A.5.5 0 018 5zm3 .5a.5.5 0 00-1 0v7a.5.5 0 001 0v-7z" clip-rule="evenodd"/>
                            </svg>
                        </p>
                    </b-list-group-item>
                </b-list-group>
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
const WORKOUTS = "workouts"

export default {
    name: 'home',
    components: {
        // NotesList,
    },
    data: () => ({
        selected_challenge: "ZpmOZVpv2YJsI9e8ZpvJ",
        participants: [],
        workouts: [],
        new_workout_entry: null,

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
            steps: 0,
            step_size_units: 0,
            step_size: 0,
            entry: 0
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
                console.log('Result     :', this.participants[p].total_result)
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
            console.log('Total Result       :', this.user_workout_data.total_result)
            console.log('Last Workout       :', this.user_workout_data.last_workout)
            console.log('Biggest Workout    :', this.user_workout_data.biggest_workout)
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

        get_user_settings() {
            var userSettingsRef = fb.db.collection(USERS).doc(this.user_info.id).collection(SETTINGS).doc(this.selected_challenge)
            userSettingsRef.get().then((doc) => {
                if (doc.exists) {
                    this.settings_info = doc.data()
                }
                this.print_user_settings()
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

        get_workouts() {
            var workoutDataRef = fb.db.collection(USERS).doc(this.user_info.id).collection(CHALLENGES).doc(this.selected_challenge).collection(WORKOUTS)
            var entryCount = 0
            workoutDataRef.get().then((doc) => {
                doc.forEach((doc) => {
                    if (doc.exists) {
                        var temp_work = doc.data()
                        temp_work.id = doc.id
                        temp_work.date = temp_work.date.toDate()
                        entryCount += temp_work.entry
                        this.workouts.push(temp_work)
                    }
                })
                this.sort_history()
                if (entryCount != this.user_workout_data.total_result) {
                    console.log("entry count mismatch", entryCount, this.user_workout_data.total_result)
                    this.updateTotalResult(entryCount, 0)
                }
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

        sort_leaderboard() {
            this.participants.sort((a, b) => (a.name < b.name) ? 1 : -1).sort((a, b) => (a.total_result < b.total_result) ? 1 : -1)
        },

        sort_history() {
            this.workouts.sort((a, b) => (a.date < b.date) ? 1 : -1)
        },

        convertSteps(units, size, steps) {
            if (units == 0) {
                return parseFloat((size / 1000 * steps).toFixed(2))
            }
            if (units == 1) {
                return parseFloat((size / 100 * steps).toFixed(2))
            }
            if (units == 2) {
                return parseFloat((size * steps).toFixed(2))
            }
        },

        // are the units configurable. need fn to check
        addWorkout() {
            if (this.new_workout_entry == null || this.new_workout_entry == 0) {
                alert("Empty workout!")
            } else {
                var newEntry = {
                    date: new Date(),
                    steps: 0,
                    step_size: 0,
                    step_size_units: 0,
                    entry: 0
                }

                if (this.challenge_info.units == 0) {
                    newEntry.steps = this.new_workout_entry
                } else if (this.challenge_info.units == 1){
                    newEntry.steps = this.new_workout_entry
                    newEntry.step_size = this.settings_info.step_size
                    newEntry.step_size_units = this.settings_info.step_size_units
                    newEntry.entry = this.convertSteps(newEntry.step_size_units, newEntry.step_size, newEntry.steps)
                }

                this.new_workout_entry = null
                
                this.saveEntry(newEntry)
            }
        },

        removeWorkout(index) {
            var wk_info = this.workouts[index]
            console.log("remove workout", index, wk_info)
            this.deleteEntry(wk_info, index)
            return index
        },

        saveEntry(entry) {
            var that = this
            fb.db.collection(USERS).doc(this.user_info.id).collection(CHALLENGES).doc(this.selected_challenge).collection(WORKOUTS)
            .add(entry)
            .then(function(docRef) {
                that.updateTotalResult(entry.entry, 1)
                entry.id = docRef.id
                that.workouts.unshift(entry)
            })
            return entry
        },

        deleteEntry(entry, index) {
            var that = this
            fb.db.collection(USERS).doc(this.user_info.id).collection(CHALLENGES).doc(this.selected_challenge).collection(WORKOUTS).doc(entry.id)
            .delete()
            .then(function() {
                that.updateTotalResult(entry.entry, -1)
                that.workouts.splice(index, 1)
                that.sort_history()
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        },

        updateTotalResult(entry, increase) {
            var replace = false
            if (increase == -1) {
                entry = entry * (-1)
            } else if (increase == 0) {
                replace = true
            }
            var userDataRef = fb.db.collection(USERS).doc(this.user_info.id).collection(CHALLENGES).doc(this.selected_challenge)
            this.updateTotalResultTransaction(userDataRef, entry, replace)
            var challengeDataRef = fb.db.collection(CHALLENGES).doc(this.selected_challenge).collection(PARTICIPANTS).doc(this.user_info.id)
            this.updateTotalResultTransaction(challengeDataRef, entry, replace)
        },

        updateTotalResultTransaction(ref, result, replace) {
            var that = this
            fb.db.runTransaction(function(transaction) {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(ref).then(function(doc) {
                    if (!doc.exists) {
                        throw "Document does not exist!";
                    }
                    var newResult = 0
                    if (replace) {
                        newResult = result;
                    } else {
                        newResult = doc.data().total_result + result;
                    }
                    transaction.update(ref, { total_result: parseFloat(newResult.toFixed(2)) });
                    return parseFloat(newResult.toFixed(2))
                });
            }).then(function(newResult) {
                that.user_workout_data.total_result = newResult
                for (var p in that.participants) {
                    if (that.participants[p].id == that.user_info.id) {
                        that.participants[p].total_result = newResult
                    }
                }
                that.sort_leaderboard()
                // console.log("Transaction successfully committed!");
            }).catch(function(error) {
                console.log("Transaction failed: ", error);
            });
        },


            // challengeRef.get().then((doc) => {
                //     if (doc.exists) {
                    //         this.type = doc.data().type
        //         this.goal = parseInt(doc.data().goal)
        //         this.hasEndDate = doc.data().hasEndDate
        //         this.challenge_start = doc.data().start_date.toDate()
        //         this.challenge_end = doc.data().end_date.toDate()
        //         var today = new Date()
        //         this.days_left = Math.floor((this.challenge_end - today) / (24 * 60 * 60 * 1000))
                

        // saveSettings() {
        //     if (this.step_size == "" || this.step_size ==0) {
        //         alert("Step size can't be zero!")
        //     } else {
        //         fb.db.collection('users').doc(this.uid).update({'step_size': this.step_size})
        //     }
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
    },
    
    created() {
        // Retrieve user data:
        this.get_user_data()
        this.get_user_settings()
        // Retrieve challenge info:
        this.get_challenge_data()
        this.get_participant_data()
        this.get_workouts()
        // // }

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
