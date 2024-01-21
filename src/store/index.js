import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    account: '',
    chainId: false,
    isEth: false,
    tokenList: [],
    rpcUrl: '',
    DefiAddress: '',
    EGTAddress: '',
    ETHAddress: '',
    TBTAddress: '0xd7F97f2cBcDC696484dA7C04AD012723392Ce30B',
    GameAddress: '',
    ADTAddress: '',
    locale: 'tw',
    langs: ['tw', 'jp', 'en', 'cn'],
    tokens: ['usdt', 'tbt'],
    currToken: '',
    nowWidth: 0,
    backendUrl: 'https://home.api-absolute-uv.com',
    backendVersion: '/api/v1',
    token: '',
  },
  mutations: {
    updateAccount(state, account){
      state.account = account
    },
    updateChainId(state, chainId){
      state.chainId = chainId
    },
    updateIsEth(state, isEth){
      state.isEth = isEth
    },
    updateToken(state, token){
      state.token = token
    },
    updateTokenList(state, tokenList){
      state.tokenList = tokenList
      let EGT = tokenList.find((item)=>item.name === 'egt')
      if (EGT){
        state.EGTAddress = EGT.tokenaddress
      }
      let ETH = tokenList.find((item)=>item.name === 'eth')
      if (ETH){
        state.ETHAddress = ETH.tokenaddress
      }
    },
    updateAddress(state, address){
      state.ADTAddress = address.adt
      state.GameAddress = address.game
    },
    updateDefiContract(state, address){
      state.DefiAddress = address
    },
    updateRpcUrl(state, url){
      state.rpcUrl = url
    },
    updateLang(state, lang){
      state.locale = lang
    },
    updateNowWidth(state, nowWidth){
      state.nowWidth = nowWidth
    },
    updateCurrToken(state, currToken){
      state.currToken = currToken
    },
    updateUserInfo(state, userInfo){
      state.userInfo = userInfo
    },
    clearInfo(state){
      state.userInfo = {}
			state.account = ''
			state.token = ''
    },
  },
  getters: {
    backendUrl(state){
      return state.currToken === 'usdt' ? 'https://egt-usd-defi.api-absolute-uv.com' : 'https://egt-tbt-defi.api-absolute-uv.com'
      // return state.currToken === 'usdt' ? 'https://staging-jackpot.egtdefibsc.com' : 'https://egttbt.egtdefibsc.com'
    },
    wsBackendUrl(state){
      return state.currToken === 'usdt' ? 'wss://egt-usd-defi.api-absolute-uv.com' : 'wss://egt-tbt-defi.api-absolute-uv.com'
      // return state.currToken === 'usdt' ? 'wss://staging-jackpot.egtdefibsc.com' : 'wss://egttbt.egtdefibsc.com'
    },
  },
  actions: {
    async getTokenPrice({ state }, data){
      console.log('state', state.chainId)
      let result = await Vue.axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${data.token}&vs_currencies=${data.currency}&include_last_updated_at=true&x_cg_pro_api_key=CG-JC54SgmUabpyX94wxVDmLffX`)
      return result.data
    },
    async getAllOrders({ getters }){
      let result = await Vue.axios.post(`${getters.backendUrl}/api/v1/orders`)
      return result.data
    },
    async getAllRecords({ state }, data){
      console.log('state', state.chainId)
      // let result = await Vue.axios.get(`https://api-rinkeby.etherscan.io/api?module=account&action=txlist&&address=${data.defiAddress}&startblock=${data.startBlock}&endblock=${data.endBlock}&page=${data.page}&apikey=C9RIE4CZZGHNE7FICYK8FWWUC2MP8WAR86`)
      let result = await Vue.axios.get(`https://api.etherscan.io/api?module=account&action=txlist&&address=${data.defiAddress}&startblock=${data.startBlock}&endblock=${data.endBlock}&page=${data.page}&apikey=C9RIE4CZZGHNE7FICYK8FWWUC2MP8WAR86`)
      return result.data
    },
    async getDefiContract({ getters, commit }){
      try{
        let result = await Vue.axios.get(`${getters.backendUrl}/api/v1/defi_contract`)
        if (result.data.status === 200){
          commit('updateDefiContract', result.data.data.contract_address)
          commit('updateRpcUrl', result.data.data.url)
        }
      }catch(error){
        console.log('error', error)
      }
    },
    async getUserInfo({ state, commit }){
			let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/user_info`, {
				headers:{
					Authorization: `Bearer ${state.token}`
				}
			})
			if (result.data.status === 672){
				commit('updateUserInfo', result.data.data)
			}else{
				commit('updateUserInfo', {})
			}
			return result.data
		},
  },
  modules: {
  }
})
