<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';
import axios from 'axios';

const { VITE_URL } = import.meta.env;

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    signin() { // 1. 登入
      axios.post(`${VITE_URL}/admin/signin`, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `HexSchoolVueToken=${token}; expires=${new Date(expired)};`;
          this.$router.push('./admin/products');
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: `錯誤 ${err.response.status}`,
            text: err.response.data.message,
            confirmButtonText: 'OK',
          });
        });
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 font-weight-normal text-center">
        請先登入
      </h1>
      <div class="col-8">
        <form id="form" class="form-signin">
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="username" v-model="user.username"
              placeholder="name@example.com" required autofocus>
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="password" v-model="user.password"
              placeholder="Password" required>
            <label for="password">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="button" @click="signin()">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted text-center">
      &copy; 2021~∞ - 六角學院
    </p>
  </div>
</template>

<style lang='scss' scoped>
  html,
      body {
        height: 100%;
        text-align: center;
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }

    .form-signin {
      width: 100%;
      max-width: 330px;
      padding: 15px;
      margin: auto;
    }
</style>
