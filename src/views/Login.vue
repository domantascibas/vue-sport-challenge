<template>
<div id="login">
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col cols="12" md="4" class="login">
                <b-container>
                    <h3>Login</h3>
                    <input type="text" v-model="email" placeholder="Email"><br>
                    <input type="password" v-model="password" placeholder="Password"><br>
                    <button @click="login()" class="btn btn-info">Login</button>
                    <!-- <p>You don't have an account? You can <router-link to='/sign-up'>create one</router-link></p> -->
                </b-container>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'login',
    data() {
        return{
            email: '',
            password: ''
        };
    },
    methods: {
        login: function() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(() => {
                this.$router.replace('home')
            },
            (error) => {
                alert('Oops ' + error.message)
            })
        }
    }
}
</script>

<style scoped>
#login {
    background: url("../assets/MainCover1.png") no-repeat center center fixed;;
    background-size: cover;
    min-height: 100%;
    width: 100%;
    left: 0;
}
.login {
    margin-top: 100px;
    padding: 50px 0 20px;
    width: 100%;
    background: rgb(240, 248, 255, 0.73);
}
input {
    margin: 10px 0;
    padding: 15px;
}
button {
    margin-top: 20px;
    cursor: pointer;
}
p {
    margin-top: 40px;
    font-size: 13px;
}
p a {
    text-decoration: underline;
    cursor: pointer;
}
</style>
