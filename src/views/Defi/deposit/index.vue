<template>
  <div class="defi-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="defi-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="`${require(`@/assets/img/icon-deposit-${$route.params.token}.png`)}`" width="60px" class="mb-5">
          <h2 class="mb-5" :class="`primary_${$route.params.token}--text`">{{ $t('toDeposit') }}</h2>
          <h3 class="mb-3" :class="`primary_${$route.params.token}--text`">{{ $t('depositRule') }}</h3>
          <ol class="mb-5">
            <li v-for="(text, i) in $t(`depositRuleText_${$route.params.token}`)" :key="i" style="white-space: pre-wrap;" v-text="text"></li>
          </ol>

          <btn class="mb-5" :buttonText="'myDeposit'" :color="`primary_${$route.params.token}`" isOutlined :isCenter="true" :width="270" @clickBtn="clickBtn('orders')"></btn>
          <btn class="mb-5" :buttonText="'orderList'" :color="`primary_${$route.params.token}`" :isCenter="true" :width="270" @clickBtn="clickBtn('list')"></btn>
          <div class="can-click" @click="$router.push({name: 'Index'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import btn from '@/components/btn.vue'
import Defi from '@/plugins/defi.js'
export default {
  name: "Defi-deposit",
  data (){
    return {
      defiContract: null,
      isMember: false,
      rules:[
        '投資人欲投資前須先將USDT存放於區塊鏈錢包中，爾後於「投資清單」中搜索投資合約並申請投資。',
        '成功投資後USDT會自動貸款給貸款人，並於「我的投資」中看到該投資合約。',
        '該投資合約時間到期前，若貸款人進行還款，借出之款項及利息會自動轉入投資人的區塊鏈錢包中。',
        '該投資合約時間到期時，若貸款人未進行還款，則抵押品90%歸投資人、10%歸平台方，投資人可於該投資合約中提出收回抵押品及利息。',
        '上述操作之ETH礦工費須投資人自行負擔。',
      ]
    }
  },
  components:{
    btn,
  },
  methods:{
    async clickBtn(link){
      if (this.$store.state.account){
        // defi isMember
        if (this.isMember || link === 'list'){
          this.$router.push(`/${this.$route.params.lang}/${this.$route.params.token}/deposit/${link}`)
        }else{
          this.$router.push({name: 'Defi-registry', params: {from: 'deposit'}})
        }
      }else{
        this.$toasted.error(this.$t('loginFirst'))
      }
    }
  },
  async mounted(){
    // defi contract
    this.defiContract = await new Defi()
    this.isMember = await this.defiContract.isMember(this.$store.state.account)
  }
}
</script>

<style lang="scss" scoped>
.defi-page{
  
}
</style>