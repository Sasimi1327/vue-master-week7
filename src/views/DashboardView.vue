<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';
import axios from 'axios';

const { VITE_URL } = import.meta.env;

export default {
  data() {
    return {
      status: false,
    };
  },
  methods: {
    // 登入驗證
    getTokenFromCookies() {
      // const token = document.cookie.replace(
      //   /(?:(?:^|.*;\s*)HexSchoolVueToken\s*=\s*([^;]*).*$)|^.*$/,
      //   '$1',
      // );
      // axios.defaults.headers.common.Authorization = token;
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)HexSchoolVueToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      this.$http.defaults.headers.common.Authorization = `${token}`;
    },
    check() { // 2. 驗證登入
      axios.post(`${VITE_URL}/api/user/check`)
        .then(() => {
          // 驗證成功
          this.status = true;
        })
        .catch((err) => {
          // 驗證失敗
          Swal.fire({
            icon: 'error',
            title: `錯誤 ${err.response?.status}`,
            text: err.response?.data.message,
            confirmButtonText: 'Got It!',
          }).then(() => {
            this.$router.push('/');
          });
        });
    },
    logout() {
      axios.post(`${VITE_URL}/logout`)
        .then((res) => {
          Swal.fire({
            title: '登出狀態',
            text: res.data.message,
            icon: 'success',
          }).then(() => {
            this.$router.push('/');
          });
        })
        .catch((err) => {
          // 驗證失敗
          Swal.fire({
            icon: 'error',
            title: `錯誤 ${err.response?.status}`,
            text: err.response?.data.message,
            confirmButtonText: 'Got It!',
          }).then(() => {
            this.$router.push('/');
          });
        });
    },
  },
  mounted() {
    this.getTokenFromCookies();
    this.check();
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button"
      data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/admin/products" class="nav-link active">產品列表</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/orders" class="nav-link">訂單列表</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/admin/coupons" class="nav-link">優惠券列表</RouterLink>
          </li>
          <li class="nav-item">
            <a href="#" @click.prevent="logout" class="nav-link">登出</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container-fluid mt-3">
    <!-- 若未用 status 判斷，則 check 未完成時
      ，卻進入 AdminProducts 的 API 導致於 401 (未經授權的錯誤)-->
    <RouterView v-if="status" />
  </div>
</template>
