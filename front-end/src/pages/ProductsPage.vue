<template>
  <h1>Products</h1>
  <div class="grid-wrap">
    <div v-for="product in products" v-bind:key="product.id in products">
      <img :src="product.imageName" />
    </div>
  </div>

</template>

<script>
import { products } from '../temp-data';
  export default {
    name: 'ProductsPage',
    components: {},
    data() {
      return {
        products,
      }
    }
  }
</script>