<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      dense
    >
      <div class="d-flex align-center">
        <v-img
          alt="defi-logo"
          class="shrink mr-2 can-click"
          contain
          :src="`${require(`@/assets/img/icon-logo.png`)}`"
          transition="scale-transition"
          width="40"
          height="40"
          @click="()=>{if ($route.name!=='Index'){ $router.push({name: 'Index', params: {lang: $store.state.locale}})}}"
        />
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <v-btn
          class="d-md-flex d-none"
          v-for="(item, i) in navbar.filter(item=>!item.isPhone)"
          :key="i"
          depressed
          exact
          :color="'rgba(0, 0, 0, 0)'"
          :to="`/${$route.params.lang}/${$route.params.token}${item.link}`"
          @click="clickNavBtn"
        >
          {{ $t(item.text) }}
        </v-btn>
        <btn class="ml-3" :buttonText="$store.state.account? `${shortAddress} ${$t('logout')}` : `${$t('login')}`" :color="`primary_${$route.params.token}`" @clickBtn="log()"></btn>
        <v-menu
          open-on-hover
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-3"
              :color="`primary_${$route.params.token}`"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>
                mdi-translate
              </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in $store.state.langs"
              :key="index"
              class="can-click"
              @click="changeLang(item)"
            >
              <v-list-item-title>{{ $t(item) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main id="main">
      <router-view/>
    </v-main>

    <v-footer
      class="pt-3 ma-2 rounded app-footer"
      style="z-index: 10;"
      app
      fixed
      color="#1B1D22"
    >
      <v-row justify="center" class="px-4">
        <v-col cols="12" sm="8" md="6" class="d-flex justify-space-between align-center">
          <router-link
            v-for="(item, i) in footer"
            :key="i"
            class="text-decoration-none footer-nav-link"
            :class="{'active-link': $route.fullPath === item.link}"
            :to="item.link"
          >
            <div class="d-flex flex-column justify-center align-center grey--text">
              <img class="mb-1" :src="`${require(`@/assets/img${item.icon}.svg`)}`" width="30px">
              <div>{{ $t(item.text) }}</div>
            </div>
          </router-link>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import btn from '@/components/btn.vue';
import base from '@/mixin/base'
export default {
  name: 'App',
  mixins: [base],
  data: () => ({
    navbar: [
      // {
      //   text: `buyEGT`,
      //   link: '/egt',
      //   icon: '/icon-buy'
      // },
      // {
      //   text: `sellEGT`,
      //   link: '/egt/sell',
      //   icon: '/icon-sell'
      // },
      {
        text: `swapEGT`,
        link: '/egt/swap',
        icon: '/icon-bscegt',
        isPhone: true,
      },
      {
        text: `calculator`,
        link: '/calculator',
        icon: '/icon-calculator'
      },
      {
        text: `community`,
        link: '/community',
        icon: `/icon-community`
      },
    ],
    defiContract: null
  }),
  components:{
    btn
  },
  computed:{
    shortAddress(){
      return `${this.$store.state.account.slice(0, 6)}...${this.$store.state.account.slice(38)}`
    },
    footer () {
      return [
        {
          text: `toDeposit`,
          link: `/${this.$route.params.lang}/${this.$route.params.token}/deposit`,
          icon: '/icon-deposit'
        },
        {
          text: `backToIndex`,
          link: `/${this.$route.params.lang}`,
          icon: '/icon-deposit'
        },
        {
          text: `toBorrow`,
          link: `/${this.$route.params.lang}/${this.$route.params.token}/borrow`,
          icon: '/icon-borrow'
        }
      ]
    }
  },
  methods:{
    async log(){
      if (this.$store.state.account){
        this.$store.commit('clearInfo')
        this.$cookies.remove('address')
        this.$router.push({name: 'Index'})
      }else{
        if (window.ethereum) {
          await this.connectMetamask()
        } else {
          window.addEventListener('ethereum#initialized', this.connectMetamask, {
            once: true,
          });

          // If the event is not dispatched by the end of the timeout,
          // the user probably doesn't have MetaMask installed.
          setTimeout(this.connectMetamask, 2000); // 3 seconds
        }
        this.$forceUpdate()
      }
    },
    clickNavBtn(e){
      if (!this.$store.state.account && this.$route.path !== '/calculator'){
        e.preventDefault()
        this.$toasted.error(this.$t('loginFirst'))
      }
    },
    changeLang(lang){
      this.$store.commit('updateLang', lang)
      this.$i18n.locale = lang
      this.$router.push({ name: this.$route.name, params: {lang: lang, token: this.$route.params.token} });
    },
    // async connectMetamask() {
    //   let _this = this
    //   if (window.ethereum){
    //     window.ethereum
    //       .request({ method: 'eth_requestAccounts' })
    //       .then(_this.handleAccountsChanged)
    //       .catch((err) => {
    //         if (err.code === 4001) {
    //           // EIP-1193 userRejectedRequest error
    //           // If this happens, the user rejected the connection request.
    //           this.$toasted.error('Please connect to MetaMask.');
    //         } else {
    //           console.error(err);
    //         }
    //       });
    //   }else{
    //     this.$toasted.error(this.$t('installMetamask'))
    //   }
    // },
    // async handleAccountsChanged(accounts){
    //   if (accounts.length === 0) {
    //     // MetaMask is locked or the user has not connected any accounts
    //     this.$toasted.error('Please connect to MetaMask.');
    //   } else if (accounts[0] !== this.$store.state.account) {
    //     this.$store.commit('updateAccount', accounts[0]);
    //     this.$cookies.set('address', accounts[0]);
    //     window.location.reload()
    //   }
    // },
    // checkChainId(chainId){
    //   let isEthereum = chainId === '0x1' || chainId === 1
    //   // let isEthereum = chainId === '0x4' || chainId === 4

    //   let isBsc = chainId === '0x38' || chainId === 56
    //   // let isBsc = chainId === '0x61' || chainId === 97
    //   this.$store.commit('updateChainId', isBsc);
    //   this.$store.commit('updateIsEth', isEthereum);
    //   if (!isBsc){
    //     if (this.$route.name !== 'Ethegt-send'){
    //       this.$toasted.error(this.$t('changeMainnet'));
    //     }
    //   }
    // }
  },
  async mounted(){
    // console.log('==========default==========')
    let _this = this

    this.$store.commit('updateNowWidth', document.body.clientWidth)
    window.onresize = () => {
      this.$store.commit('updateNowWidth', document.body.clientWidth)
    }

    if (window.ethereum){
      // metamask disconnect
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0){
          this.$cookies.remove('address')
          this.$store.commit('clearInfo')
          this.$toasted.error(_this.$t('connectionBreak'))
        }else{
          this.$store.commit('updateAccount', accounts[0]);
          this.$cookies.set('address', accounts[0]);
          this.$toasted.show(_this.$t('changeWallet'));
          window.location.reload()
        }
      });

      // get chain id
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.checkChainId(chainId)
      window.ethereum.on('chainChanged', _this.checkChainId);

      if (!window.ethereum.selectedAddress){
        let address = this.$cookies.get('address')
        if (address){
          this.$cookies.remove('address')
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '../src/assets/scss/font.scss';
// layout
#main{
  background: url('../src/assets/img/background.png') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.card-wrap{
  padding: 40px 60px;
  box-shadow: 0 4px 16px 4px rgb(0 0 0 / 20%) !important;
  @media (max-width: 600px){
    padding: 40px 20px;
  }
}
.app-footer {
  .footer-nav-link {
    position: relative;
    &.active-link::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 5px;
      background: url('./assets/img/deco-footer-active.svg');
      // width: 100px;
      // height: 10px;
      // background: green !important;
    }
  }
}
// common style
.text-shadow{
  text-shadow: 0 2px 5px #333;
}
.gas-text{
  font-size: 24px;
}
.can-click{
  cursor: pointer;
}
.toasted.toasted-primary.error{
  background-color: #E53935 !important;
}
.toasted.toasted-primary.default{
  background-color: #0abbb5 !important;
}
</style>