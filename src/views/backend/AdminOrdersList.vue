<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';

import PaginationComponent from '@/components/PaginationComponent.vue';
import OrderModal from '@/components/OrderModal.vue';
import RemoveModal from '@/components/RemoveModal.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      orders: [],
      pages: {},
      selectOrder: {},
      isLoading: false,
    };
  },
  methods: {
    getOrders(page = 1) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/orders?page=${page}`; // 有分頁
      this.isLoading = true;
      this.$http.get(url)
        .then((res) => {
          this.orders = res.data.orders;
          this.pages = res.data.pagination;
          this.isLoading = false;
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
    updatePaidStatus(order) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/order/${this.selectOrder.id}`;
      const paid = {
        is_paid: order.is_paid,
      };
      this.$http.put(url, { data: paid })
        .then((res) => {
          this.isLoading = false;
          this.getOrders(this.pages.current_page);
          this.$refs.oModal.hideModal();
          Swal.fire({
            icon: 'success',
            title: res.data.message,
            confirmButtonText: 'OK',
          });
        });
    },
    deleteOrder() {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/order/${this.selectOrder.id}`;
      this.$http.delete(url)
        .then(() => {
          this.isLoading = false;
          this.getOrders(this.pages.current_page);
          this.$refs.delModal.hideModal();
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
    // 開啟 edit model
    openEditModal(item) {
      this.selectOrder = { ...item };
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.oModal.showModal();
    },
    // 開啟 remove model
    openDeleteModal(item) {
      this.selectOrder = { ...item };
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.delModal.showModal();
    },
  },
  components: {
    PaginationComponent,
    OrderModal,
    RemoveModal,
  },
  mounted() {
    this.getOrders();
  },
};
</script>
<template>
  <div class="container">
    <VueLoading v-model:active="isLoading"></VueLoading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>
            購買時間
          </th>
          <th>
            電子郵件
          </th>
          <th>
            購買款項
          </th>
          <th class="text-center">
            應付金額
          </th>
          <th>
            是否付款
          </th>
          <th class="text-center">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="order in orders" :key="order.id">
          <tr v-if="orders.length" :style="{backgroundColor: order.is_paid ? 'lightblue' : ''}">
            <td>{{ new Date(order.create_at*1000).toLocaleDateString('zh-TW') }}</td>
            <td>{{ order.user.email }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(product, key) in order.products" :key="key">
                  {{ product.product.title }} / {{ product.qty }}{{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-center">{{ order.total }}</td>
            <td>
              <span v-if="order.is_paid" class="text-success text-end">已付款</span>
              <span v-else class="text-end">未付款</span>
            </td>
            <td>
              <div class="btn-group">
                <button type="button" class="btn btn-outline-primary btn-sm"
                @click="openEditModal(order)"
                >
                  檢視
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm"
                @click="openDeleteModal(order)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <PaginationComponent
      :pages="pages"
      @emit-pages="getOrders"
    ></PaginationComponent>
  </div>
  <!-- Modal -->
  <OrderModal
    ref="oModal"
    :order="selectOrder"
    @update-order="updatePaidStatus"
  ></OrderModal>
  <RemoveModal
    ref="delModal"
    :item="selectOrder"
    @del-item="deleteOrder"
  ></RemoveModal>
  <!-- Modal -->
</template>
