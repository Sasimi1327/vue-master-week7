<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';
import axios from 'axios';

import PaginationComponent from '@/components/PaginationComponent.vue';
import CouponModal from '@/components/CouponModal.vue';
import RemoveModal from '@/components/RemoveModal.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;
const baseUrl = `${VITE_URL}/api/${VITE_PATH}/admin/coupon`;

export default {
  data() {
    return {
      coupons: [],
      selectCoupon: {
        title: '',
        code: '',
        due_date: '',
        is_enabled: 0,
        percent: 100,
      },
      pages: {},
      isLoading: false,
      isNew: false,
    };
  },
  methods: {
    getCoupons(page = 1) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/coupons?page=${page}`; // 有分頁
      this.isLoading = true;
      this.$http.get(url)
        .then((res) => {
          this.isLoading = false;
          this.coupons = res.data.coupons;
          this.pages = res.data.pagination;
        })
        .catch((err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: `錯誤 ${err.response.status}`,
            text: err.response.data.message,
            confirmButtonText: 'OK',
          });
        });
    },
    updateCoupon(coupon) {
      const url = `${baseUrl}/${this.selectCoupon.id ? this.selectCoupon.id : ''}`;
      const updateData = {
        data: coupon,
      };

      const reqMethod = this.selectCoupon.id ? 'put' : 'post';

      axios[reqMethod](url, updateData)
        .then(() => {
          this.$refs.cpsModal.hideModal();
          this.getCoupons(this.pages.current_page);
          this.selectCoupon = {
            title: '',
            code: '',
            due_date: '',
            is_enabled: 0,
            percent: 100,
          };
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
    deleteCoupon() {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/coupon/${this.selectCoupon.id}`;
      this.isLoading = true;
      this.$http.delete(url)
        .then(() => {
          this.isLoading = false;
          this.getCoupons(this.pages.current_page);
          this.$refs.delModal.hideModal();
        })
        .catch((err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: `錯誤 ${err.response?.status}`,
            text: err.response?.data.message,
            confirmButtonText: 'OK',
          });
        });
    },
    // 開啟 new model
    openNewModal() {
      this.selectCoupon = {
        is_enabled: 0,
      };
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.cpsModal.showModal();
    },
    // 開啟 edit model
    openEditModal(item) {
      this.selectCoupon = { ...item };
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.cpsModal.showModal();
    },
    // 開啟 remove model
    openDeleteModal(item) {
      this.selectCoupon = { ...item };
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.delModal.showModal();
    },
  },
  components: {
    PaginationComponent,
    CouponModal,
    RemoveModal,
  },
  mounted() {
    this.getCoupons();
  },
};
</script>
<template>
  <div class="container">
    <VueLoading v-model:active="isLoading"></VueLoading>
    <div class="text-end mt-4">
      <button type="button"
      class="btn btn-primary"
      @click="openNewModal()">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>到期日</th>
          <th>折扣百分比</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coupon in coupons" :key="coupon.id">
          <td>{{ coupon.title }}</td>
          <td>{{ new Date(coupon.due_date*1000).toLocaleDateString('zh-TW') }}</td>
          <td>{{ coupon.percent }}</td>
          <td>
            <span v-if="coupon.is_enabled" class="text-success text-end">已啟用</span>
            <span v-else class="text-end">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button"
              @click="openEditModal(coupon)"
              class="btn btn-outline-primary btn-sm">
                編輯
              </button>
              <button type="button"
              @click="openDeleteModal(coupon)"
              class="btn btn-outline-danger btn-sm">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationComponent
      :pages="pages"
      @emit-pages="getCoupons"
    ></PaginationComponent>
  </div>
  <CouponModal
    :select-coupon="selectCoupon"
    @update-coupon="updateCoupon"
    ref="cpsModal"
  ></CouponModal>
  <RemoveModal
    ref="delModal"
    :item="selectCoupon"
    @del-item="deleteCoupon"
  ></RemoveModal>
</template>
