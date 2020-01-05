<template>
    <div class="sign-up">
        <p>Let's create a new account !</p>
        <input type="text" v-model="email" placeholder="Email"><br>
        <input type="password" v-model="password" placeholder="Password"><br>
        <button @click="signUp">Sign Up</button>
        <span>Or go back to <router-link to='/login'>login</router-link></span>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'signUp',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        signUp: function() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(() => {
                this.$router.replace('home')
                // alert('Your account has been created !')
    //   this.alertService.alertPopup('Success', 'Code Updated')
            },
            (error) => {
                alert('Oops ' + error.code + ' ' + error.message)
            });
        }
    }
}
</script>

<style scoped>
    .signUp {
        margin-top: 40px;
    }
    input {
        margin: 10px 0;
        width: 20%;
        padding: 15px;
    }
    button {
        margin-top: 10px;
        width: 10%;
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
    span {
        display: block;
        margin-top: 20px;
        font-size: 11px;
    }
</style>
