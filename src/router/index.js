import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: '登入頁',
    component: () => import('../views/frontend/LoginView.vue'),
  },
  {
    path: '/admin',
    component: () => import('../views/DashboardView.vue'),
    children: [
      {
        path: 'products',
        name: '產品列表',
        component: () => import('../views/backend/AdminProductsList.vue'),
      },
      {
        path: 'orders',
        name: '訂單列表',
        component: () => import('../views/backend/AdminOrdersList.vue'),
      },
      {
        path: 'coupons',
        name: '優惠券列表',
        component: () => import('../views/backend/AdminCouponsList.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/ErrorPage.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

export default router;
