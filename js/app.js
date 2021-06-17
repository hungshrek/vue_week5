import userProductModal from './userProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

// configure({
//   generateMessage: localize('zh_TW'),
// });


VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

//api 網址
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'hungmarty-api';


const app=Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
      isLoading: false,
      cartAmont: '',
    };
  },
  components: {
    // VForm: Form,
    // VField: Field,
    // ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts(page = 1) {
      const url = `${apiUrl}/api/${apiPath}/products`;

      this.isLoading = true; 
    
      axios.get(url)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.products);
          this.products = response.data.products;
        } else {
          alert(response.data.message);
        }
      })
      .catch(err =>{
        console.log(err.message);
       })
      .finally(()=>{
        this.isLoading = false; 
    });
    },
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
    //  this.loadingStatus.loadingItem = id;

      this.isLoading = true;

      axios.get(url)
      .then((response) => {
        if (response.data.success) {
      //    this.loadingStatus.loadingItem = '';
          this.product = response.data.product;
          this.$refs.userProductModal.openModal();
        } else {
          alert(response.data.message);
        }
      })
      .catch(err =>{
        console.log(err.message);
       })
      .finally(()=>{
        this.isLoading = false; 
      });
    },
    addToCart(id, qty = 1) {

      this.isLoading = true;

      const url = `${apiUrl}/api/${apiPath}/cart`;
     // this.loadingStatus.loadingItem = id;

      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
       //   this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(response.data.message);
        }
      })
      .catch(err=>{
        console.log(err.message);
      })
      .finally(()=>{
        this.isLoading = false; 
      });
    },  
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`; // 購物車 id
      const cart = {
        product_id: data.product_id,  // 產品 id
        qty: data.qty,
      };
      axios.put(url, { data: cart }).then((response) => {
        if(response.data.success) {
          alert(response.data.message);
       //   this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(response.data.message);
       //   this.loadingStatus.loadingItem = '';
        }
      });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((response) => {
        if (response.data.success) {
          this.cart = response.data.data;
          this.cartAmont = this.cart.carts.length; //判斷購物車是否為空
        } else {
          alert(response.data.message);
        }
      });
    },
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(response.data.message);
        }
      });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          this.$refs.form.resetForm(); //送出表單後 不觸發驗證
          this.getCart();
        } else {
          alert(response.data.message)
        }
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
})

//vue loading
app.component('loading',VueLoading);
//vue validate
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.component('userProductModal', userProductModal);

app.mount('#app');
