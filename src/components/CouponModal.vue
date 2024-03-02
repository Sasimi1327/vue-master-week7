<script>
import { Modal } from 'bootstrap';

export default {
  props: ['selectCoupon'],
  watch: {
    selectCoupon() {
      this.tempCoupon = this.selectCoupon;

      this.due_date = new Date(this.tempCoupon.due_date * 1000).toLocaleDateString();
    },
    due_date() {
      this.tempCoupon.due_date = Math.floor(new Date(this.due_date) / 1000);
    },
  },
  data() {
    return {
      bsCouponModal: null,
      tempCoupon: {},
      due_date: '',
    };
  },
  methods: {
    // Modal 控制
    showModal() {
      this.bsCouponModal.show();
    },
    hideModal() {
      this.bsCouponModal.hide();
    },
    rangeCheck(evt) {
      const inputVal = evt.target.value;
      if (Number.parseInt(inputVal, 10) > 100) {
        this.tempCoupon.percent = 100;
      } else if (Number.parseInt(inputVal, 10) < 0) {
        this.tempCoupon.percent = 0;
      }
    },
  },
  mounted() {
    this.bsCouponModal = new Modal(this.$refs.couponModal);
  },
};
</script>
<template>
  <div id="couponModal" ref="couponModal"
  class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="couponModalLabel" class="modal-title">
            <span v-if="tempCoupon.id">編輯優惠券</span>
            <span v-else>新增優惠券</span>
          </h5>
          <button type="button" class="btn-close btn-close-white"
          data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input id="title" type="text"
                      class="form-control"
                      placeholder="請輸入標題"
                      v-model="tempCoupon.title">
            </div>

            <div class="mb-3">
              <label for="coupon_code" class="form-label">優惠碼</label>
              <input id="coupon_code" type="text"
                      class="form-control"
                      placeholder="請輸入優惠碼"
                      v-model="tempCoupon.code">
            </div>

            <div class="mb-3">
              <label for="due_date" class="form-label">到期日</label>
              <VueDatePicker
                v-model="due_date"
                :min-date="new Date()"
                :enable-time-picker="false"
              ></VueDatePicker>
            </div>

            <div class="mb-3">
              <label for="discount" class="form-label">折扣(百分比)</label>
              <input id="discount" type="number"
                      min="0" max="100"
                      @change="rangeCheck"
                      class="form-control"
                      placeholder="請輸入折扣百分比"
                      v-model="tempCoupon.percent">
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :true-value="1"
                :false-value="0"
                id="is_enabled"
                v-model="tempCoupon.is_enabled"
              />
              <label class="form-check-label" for="is_enabled">
                <span v-if="tempCoupon.is_enabled" class="text-success">已啟用</span>
                <span v-else>未啟用</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-primary"
          @click="$emit('update-coupon', tempCoupon)"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
