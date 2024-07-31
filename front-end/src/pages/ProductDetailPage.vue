<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product.imageUrl" width="350px" />
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button v-if="user && !inCart" @click="addToCart" class="add-to-cart">
        Add to Cart
      </button>
      <button v-if="user && inCart" disabled class="add-to-cart grey-button">
        Already in Cart
      </button>
      <button class="sign-in" @click="signIn" v-if="!user">
        Sign In to Add to Cart
      </button>
    </div>
  </div>
  <div v-else>
    <NotFoundPage />
  </div>
</template>

<script>
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import NotFoundPage from "./NotFoundPage.vue";
import axios from "axios";

export default {
  name: "ProductDetailPage",
  components: {
    NotFoundPage,
  },
  props: ["user"],
  data() {
    return {
      product: {},
      inCart: [],
    };
  },
  watch: {
    async user(newUserValue) {
      if (newUserValue) {
        const responsev2 = await axios.get(`/api/users/${this.user.uid}/cart`);
        const cartItems = responsev2.data;
        const inCart = cartItems.find(
          (item) => item.id === this.$route.params.productId
        );
        this.inCart = inCart;
      }
    },
  },
  methods: {
    async addToCart() {
      await axios.post(`/api/users/${this.user.uid}/cart`, {
        id: this.$route.params.productId,
      });
      alert("Sucessfully added item to cart");
    },
    async signIn() {
      const email = prompt("Please enter your email address to sign in:");
      const auth = getAuth();
      const actionCodeSettings = {
        url: `http://localhost:8080/products/${this.$route.params.productId}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert("Check your inbox for a link to login");
      window.localStorage.setItem("emailForSignIn", email);
    },
  },
  async created() {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      await signInWithEmailLink(auth, email, window.location.href);
      alert("Sucessfully signed in!");
      window.localStorage.removeItem("emailForSignIn");
    }
    const responsev1 = await axios.get(
      `/api/products/${this.$route.params.productId}`
    );
    const product = responsev1.data;
    this.product = product;

    if (this.user) {
      const responsev2 = await axios.get(`/api/users/${this.user.uid}/cart`);
      const cartItems = responsev2.data;
      const inCart = cartItems.find((item) => item.id === product.id);
      this.inCart = inCart;
    }
  },
};
</script>
