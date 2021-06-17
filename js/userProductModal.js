export default {
  template: '#userProductModal',
  props: {
    product: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      status: {},
      modal: '',
      qty: 1,
    };
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,    // 按 esc 鍵盤不關閉
      backdrop: 'static'  // 按背景不關閉
    });
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
}