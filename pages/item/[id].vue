<template>
  <div class="wrapper">
    <!-- prettier-ignore -->
    <section class="item-wrapper point-bot">
    <div class="item-container">
      <div class="left-column">
        <div class="img-wrapper">
          <img :src="resolvedImgPath()" alt="Item Image" />
        </div>
        <div v-if="item">
          <div  v-for="(image, index) in item.moreImages" :key="'image-' + index" class="img-wrapper">
          <img v-if="image" :src="image" :alt="'Additional Image ' + (index + 1)" />
        </div>
      </div>
      </div>
      <div class="right-column" v-if="item">
        <h1>{{ item.name }}</h1>
        <p class="header">${{ item.price.toFixed(2) }}</p>
        <p class="preview">{{ item.preview }}</p>
        <div class="item-quantity">
          <button @click="decreaseQuantity(item._id)">-</button>
          <p>{{ itemInCart ? itemInCart.quantity : 0 }}</p>
          <button @click="increaseQuantity(item._id)">+</button>
        </div>
        <button class="honey-button" @click="addToCart(item)">Add to Cart</button>
        <p class="description">{{ item.description }}</p>
      </div>
    </div>
    </section>
    <!-- prettier-ignore -->
    <section class="FAQ">
      <WebSectionsFAQ />
      <SubcomponentsContactBanner graphicPath="ContactBannerGraphic.svg" buttonClass="contact-button" buttonPath="/contact" backgroundPath="ContactBannerBG.svg"/>
    </section>
  </div>
</template>
  
<script setup>
const { data: item } = await useFetch(`/api/items?_id=${useRoute().params.id}`);
const store = useItemStore();

// SEO ADJUST
useSeoMeta({
  // title: post.value.mainTitle,
  // ogTitle: post.value.mainTitle,
  // description: post.value.preview,
  // ogDescription: post.value.preview,
  // ogImage: post.value.thumbnail,
  // twitterCard: post.value.thumbnail,
});

// Computed property for image path
function resolvedImgPath() {
  if (item.value.image) {
    return "/" + item.value.image;
  }
}

// Redirect if item is not found
// onMounted(() => {
//   if (!item.value) {
//     useRouter().push("/products");
//   }
// });

// Computed property for checking if item is in cart
const itemInCart = computed(() => {
  return store.cart.find((cartItem) => cartItem._id === item.value?._id);
});

// Methods
const addToCart = () => {
  store.addToCart(item.value);
};

const removeFromCart = (itemId) => {
  store.removeItem(itemId);
};

const increaseQuantity = () => {
  if (itemInCart.value) {
    store.updateQuantity({
      itemId: item.value._id,
      quantity: itemInCart.value.quantity + 1,
    });
  } else {
    addToCart(item.value);
  }
};

const decreaseQuantity = () => {
  if (itemInCart.value && itemInCart.value.quantity > 1) {
    store.updateQuantity({
      itemId: item.value._id,
      quantity: itemInCart.value.quantity - 1,
    });
  } else if (itemInCart.value && itemInCart.value.quantity === 1) {
    removeFromCart(item.value._id);
  }
};

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>
      

<style scoped>
.wrapper {
}

.item-wrapper {
  background: url("/HoneyCombBG.svg") no-repeat;
  background-size: cover;
  color: #f1b55c;
  font-family: Bebas Neue, cursive;
}

.item-container {
  display: flex;
  justify-content: space-between;
  min-height: 55rem;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12rem 2rem;
}

.left-column,
.right-column {
  width: 45%;
  justify-content: baseline;
  height: 100%;
}

.img-wrapper {
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right-column h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bolder;
}

.right-column .header {
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: bolder;
}

.right-column .preview {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.right-column p.description {
  font-size: 2rem;
  margin-bottom: 1em;
  white-space: pre-line;
}

.item-quantity {
  display: flex;
  gap: 1rem;
  align-items: center;
  text-align: center;
  margin: 2rem 0;
}

.item-quantity p {
  font-size: 30px;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  margin: 0;
}

.item-quantity button {
  font-size: 24px;
  width: 2rem;
  height: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
}

.item-quantity button:hover {
  color: black;
  background: #f7c781;
  cursor: pointer;
  border: none;
}

.description {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  .item-container {
    flex-direction: column;
    padding: 5rem;
  }

  .left-column,
  .right-column {
    width: 100%;
    height: 45%;
  }

  .right-column h1 {
    margin-top: 2rem;
  }
}

@media (max-width: 480px) {
  .item-container {
    padding: 5rem 2rem;
  }

  .item-quantity p {
    font-size: 36px;
  }

  .item-quantity button {
    font-size: 30px;
    width: 3rem;
    height: 3rem;
  }
}
</style>