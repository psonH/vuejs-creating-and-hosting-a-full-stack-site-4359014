<template>
  <h1>My Shopping Cart</h1>
  <ShoppingCartList
    @remove-from-cart="removeFromCart($event)"
    :cartItems="cartItems"
  />
</template>

<script>
import ShoppingCartList from "@/components/ShoppingCartList.vue";
import axios from "axios";

export default {
  name: "ShoppingCartPage",
  props: ["user"],
  components: {
    ShoppingCartList,
  },
  data() {
    return {
      cartItems: [],
    };
  },
  methods: {
    async removeFromCart(productId) {
      const response = await axios.delete(
        `/api/users/${this.user.uid}/cart/${productId}`
      );
      const updatedCart = response.data;
      this.cartItems = updatedCart;
    },
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
  async created() {
    if (this.user) {
      const response = await axios.get(`/api/users/${this.user.uid}/cart`);
      const cartItems = response.data;
      this.cartItems = cartItems;
    }
  },
};
</script>
