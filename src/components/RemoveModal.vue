<script>

import { Modal } from 'bootstrap';

export default {
  props: ['item'],
  data() {
    return {
      bsDelModal: null,
    };
  },
  methods: {
    // Modal 控制
    showModal() {
      this.bsDelModal.show();
    },
    hideModal() {
      this.bsDelModal.hide();
    },
    deleteProduct() {
      this.$emit('del-item');
    },
  },
  mounted() {
    this.bsDelModal = new Modal(this.$refs.delProductModal);
  },
};
</script>
<template>
  <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
  aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button type="button" class="btn-close btn-close-white"
          data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{ item.title ? item.title : item.id }}</strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger"
          @click="deleteProduct"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
