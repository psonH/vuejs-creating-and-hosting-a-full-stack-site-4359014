import { createApp } from "vue";
import App from "./App.vue";
import "./main.css";
import * as VueRouter from "vue-router";
import ShoppingCartPage from "./pages/ShoppingCartPage.vue";
import ProductsPage from "./pages/ProductsPage.vue";
import ProductDetailPage from "./pages/ProductDetailPage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ4ffIywwrwZYQQnQb_4u-drifB35SDaU",
  authDomain: "fsv-project-auth.firebaseapp.com",
  projectId: "fsv-project-auth",
  storageBucket: "fsv-project-auth.appspot.com",
  messagingSenderId: "325128222700",
  appId: "1:325128222700:web:e522ffed4b6794ff4a72c9",
};

initializeApp(firebaseConfig);

createApp(App)
  .use(
    VueRouter.createRouter({
      history: VueRouter.createWebHistory(process.env.BASE_URL),
      routes: [
        { path: "/cart", component: ShoppingCartPage },
        { path: "/products", component: ProductsPage },
        { path: "/products/:productId", component: ProductDetailPage },
        { path: "/:pathMatch(.*)*", component: NotFoundPage },
        { path: "/", redirect: "/products" },
      ],
    })
  )
  .mount("#app");
