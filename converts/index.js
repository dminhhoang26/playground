; (($, window, Vue) => {
  const { createApp } = Vue
  const mainApp = createApp({
    mixins: [],
    data: () => {
      return {
        consts: {

        },
        priceForm: {
          basePrice: 0,
          targetPrice: 0,
          baseExchangeRate: 0,
          baseUsdt: 0,
          targetUsdt: 0,
          targetExchangeRate: 0,
          percent: 0,
        },
      }
    },
    async created() {
      console.log(`created `, )
    },
    async mounted() {},
    unmounted() {},
    methods: {
      calPercent() {
        const vm = this
        const cal = (base, target) => {
          return (base > 0) ? Math.round(((target - base) / base * 100) * Math.pow(10, 2)) / Math.pow(10, 2) : 0
        }
        let basePrice = vm.priceForm.basePrice || 0
        let targetPrice = vm.priceForm.targetPrice || 0
        if (basePrice === targetPrice && basePrice === 0) {
          basePrice = vm.priceForm.baseUsdt || 0
          targetPrice = vm.priceForm.targetUsdt || 0
        }
        vm.priceForm.percent = cal(basePrice, targetPrice)
      },
      toUsdt(coin, rate) {
        // from input coin
        return coin * rate
      },
      toCoin(usdt, rate) {
        // from input usdt
        let result = 0
        if (rate > 0) {
          result = usdt / rate
        }
        return result
      },
      toCoinClicked(event) {
        const vm = this
        if (vm.priceForm.targetExchangeRate) {
          vm.priceForm.targetPrice = vm.toCoin(vm.priceForm.targetUsdt, vm.priceForm.targetExchangeRate)
          vm.priceForm.basePrice = vm.toCoin(vm.priceForm.baseUsdt, vm.priceForm.targetExchangeRate)
        }
      },
      toUsdtClicked(event) {
        const vm = this
        if (vm.priceForm.baseExchangeRate > 0) {
          vm.priceForm.baseUsdt = vm.toUsdt(vm.priceForm.basePrice, vm.priceForm.baseExchangeRate)
          vm.priceForm.targetUsdt = vm.toUsdt(vm.priceForm.targetPrice, vm.priceForm.baseExchangeRate)
        }
      },
    },
    computed: {

    },
    watch: {
      'priceForm.basePrice'(newVal, oldVal) {
        const vm = this
        vm.calPercent()
      },
      'priceForm.targetPrice'(newVal, oldVal) {
        const vm = this
        vm.calPercent()
      },
      'priceForm.baseUsdt'(newVal, oldVal) {
        const vm = this
        vm.calPercent()
      },
      'priceForm.targetUsdt'(newVal, oldVal) {
        const vm = this
        vm.calPercent()
      },
    },
  })

  mainApp.mount('#app')
})(jQuery, window, Vue);
