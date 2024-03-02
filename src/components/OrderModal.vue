<script>

import { Modal } from 'bootstrap';

export default {
  props: ['order'],
  data() {
    return {
      bsOrderModal: null,
      selectOrder: {},
    };
  },
  watch: {
    order() {
      this.selectOrder = { ...this.order };
    },
  },
  methods: {
    // Modal 控制
    showModal() {
      this.bsOrderModal.show();
    },
    hideModal() {
      this.bsOrderModal.hide();
    },
  },
  mounted() {
    this.bsOrderModal = new Modal(this.$refs.orderModal);
  },
};
</script>

<template>
  <div id="orderModal" ref="orderModal"
  class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>訂單明細</span>
          </h5>
          <button type="button" class="btn-close btn-close-white"
          data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4">
              <h3>用戶資料</h3>
              <table class="table">
                <tbody v-if="selectOrder.user">
                  <tr>
                    <th>姓名：</th>
                    <td>{{ selectOrder.user.name }}</td>
                  </tr>
                  <tr>
                    <th>電子郵件：</th>
                    <td>{{ selectOrder.user.email }}</td>
                  </tr>
                  <tr>
                    <th>電話：</th>
                    <td>{{ selectOrder.user.tel }}</td>
                  </tr>
                  <tr>
                    <th>地址：</th>
                    <td>{{ selectOrder.user.address }}</td>
                  </tr>
                  <tr>
                    <th>顧客留言：</th>
                    <td>{{ selectOrder.message ? selectOrder.message : '無' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-8">
              <h3>訂單明細</h3>
              <table class="table">
                <tbody>
                  <tr>
                    <th style="width: 100px">訂單編號</th>
                    <td>{{ selectOrder.id }}</td>
                  </tr>
                  <tr>
                    <th style="width: 100px">下單時間</th>
                    <td>{{ new Date(order.create_at*1000).toLocaleDateString('zh-TW') }}</td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <span v-if="selectOrder.is_paid" class="text-success">已付款</span>
                      <span v-else class="text-muted">未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>
                      {{ selectOrder.total }} 元
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3>選購商品</h3>
              <table class="table">
                <tbody>
                  <tr v-for="product in selectOrder.products" :key="product.id">
                    <th>{{ product.product.title }}</th>
                    <td>{{ product.qty }}{{ product.product.unit }}</td>
                    <td class="text-end">NT$ {{ product.total }} </td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-end">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="isPaidCheck"
                    v-model="selectOrder.is_paid"
                  />
                  <label class="form-check-label" for="isPaidCheck">
                    <span v-if="selectOrder.is_paid">已付款</span>
                    <span v-else>未付款</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-body d-flex justify-content-end">
          <button type="button"
                class="btn btn-outline-secondary me-2"
                data-bs-dismiss="modal">
            取消
          </button>
          <button type="button"
              class="btn btn-primary"
              @click="$emit('update-order', selectOrder)"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
