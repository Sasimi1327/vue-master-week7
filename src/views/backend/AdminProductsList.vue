<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';
import axios from 'axios';

import PaginationComponent from '@/components/PaginationComponent.vue';
import ProductModal from '@/components/ProductModal.vue';
import RemoveModal from '@/components/RemoveModal.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;
const baseUrl = `${VITE_URL}/api/${VITE_PATH}/admin/product`;

export default {
  data() {
    return {
      products: {},
      selectProduct: {
        imagesUrl: [],
      },
      pages: {},
      isLoading: false,
    };
  },
  methods: {
    // Modal 控制
    // ? 已搬移至元件內，讓內層的 Modal 直接調用
    // 產品方法
    getProducts(page = 1) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/products?page=${page}`; // 有分頁
      this.isLoading = true;
      this.$http.get(url)
        .then((res) => {
          this.products = res.data.products;
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
    updateProduct() {
      const url = `${baseUrl}/${this.selectProduct.id ? this.selectProduct.id : ''}`;
      const updateData = {
        data: this.selectProduct,
      };
      const reqMethod = this.selectProduct.id ? 'put' : 'post';

      axios[reqMethod](url, updateData)
        .then(() => {
          this.$refs.prodModal.hideModal();
          this.getProducts(this.pages.current_page);
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
    deleteProduct() {
      const url = `${baseUrl}/${this.selectProduct.id}`;
      axios.delete(url)
        .then(() => {
          this.$refs.delModal.hideModal();
          this.getProducts(this.pages.current_page);
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
    // 開啟 new model
    openNewModal() {
      this.selectProduct = {};
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.prodModal.showModal();
    },
    // 開啟 edit model
    openEditModal(item) {
      this.selectProduct = { ...item };
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.prodModal.showModal();
    },
    // 開啟 remove model
    openDeleteModal(item) {
      this.selectProduct = { ...item };
      //! [註]: 2. 這邊的 $refs 是綁定在元件上，父元件可透過 $refs 取得子元件內的資料和方法
      this.$refs.delModal.showModal();
    },
  },
  components: {
    PaginationComponent,
    ProductModal,
    RemoveModal,
  },
  mounted() {
    this.getProducts();
  },
};
</script>
<template>
  <div class="container">
    <VueLoading v-model:active="isLoading"></VueLoading>
    <div class="text-end mt-4">
      <button class="btn btn-primary"
        @click="openNewModal()"
      >
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>
            產品名稱
          </th>
          <th width="120" class="text-center">
            原價
          </th>
          <th width="120" class="text-center">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120" class="text-center">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-center">{{ product.origin_price }}</td>
          <td class="text-center">{{ product.price }}</td>
          <td>
            <span v-if="product.is_enabled" class="text-success text-end">啟用</span>
            <span v-else class="text-end">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary btn-sm"
              @click="openEditModal(product)"
              >
                編輯
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm"
              @click="openDeleteModal(product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationComponent
      :pages="pages"
      @emit-pages="getProducts"
    ></PaginationComponent>
  </div>
  <!-- Modal -->
  <ProductModal
    :select-product="selectProduct"
    :update-product="updateProduct"
    ref="prodModal"
  ></ProductModal>

  <RemoveModal
    :item="selectProduct"
    @del-item="deleteProduct"
    ref="delModal"
  ></RemoveModal>
  <!-- Modal -->
</template>
