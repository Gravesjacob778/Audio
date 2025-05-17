---
applyTo: "**/*.ts,**/*.vue"
---
# Project coding standards for TypeScript and VUE
# 使用規則
- 可參考VUE網址: https://vuejs.org/
- 可參考Type script 網址: https://www.typescriptlang.org/
- 可參考boostrap 網址: https://bootstrap5.hexschool.com/
- 註解使用繁體字
- 使用Type Script
- 使用VUE 3.5
- AXIOS請引用useAxiosStore.ts裡的createAxiosInstance()
- 每發送AXIOS 須設定參數 timeout預設為 3000
- 使用AXIOS串接API，AXIOS回傳的值可以從Models.ts interface DataRs 去對應，使用AXIOS不使用try catch，回傳API依照以下範例
  範例:
  const response: DataRs = await axios.post('PlanHR/ShowEditView', params, {
  timeout: 30000,
  })
  if (response.status === ResponseStatus.SUCCESS || response.status === ResponseStatus.NO_DATA) { 
    
  } else {
    console.error('取得員工資料失敗:', response.message)
  }
- 如果有要連續使用if else 判斷的話，盡量不使用巢狀判斷式 
  錯誤範例: 
    if (response.status === ResponseStatus.SUCCESS || response.status === ResponseStatus.NO_DATA) {
        doneTypeOptions.value = response.data
        if (doneTypeOptions.value.length > 0) {
            selectedDoneType.value = doneTypeOptions.value[0].detlCode!
        }
    } else {
        console.error('取得進度成果下拉失敗:', response.message)
    }
  正確示範:
  if (response.status != ResponseStatus.SUCCESS && response.status != ResponseStatus.NO_DATA){
    console.error('取得進度成果下拉失敗:', response.message)
    return 
  }
    doneTypeOptions.value = response.data
        if (doneTypeOptions.value.length > 0) {
            selectedDoneType.value = doneTypeOptions.value[0].detlCode!
        }
- 不使用magic number，請使用enum做顯示
- HTML標籤屬性`id`和`name`命名規則：
  - 使用描述性命名，能夠描述元素功能或內容
  - 使用小寫字母和連字符（-）分隔單詞
  - 避免使用數字，除非有特定意義
  - 保持一致性，整個項目中遵循相同的命名規則
  - 避免使用保留字
  - 確保名稱能夠反映元素的語義和用途
- Vue和TypeScript編碼規則：
  - 組件使用PascalCase命名，文件名與組件名一致
  - 使用單文件組件格式，並在`<script>`中使用TypeScript
  - 屬性和方法使用駝峰式命名，並明確類型定義
  - 使用Vuex或Pinia進行狀態管理
  - 模板語法簡潔，使用`v-bind`和`v-on`縮寫
  - 使用Scoped CSS和BEM命名法
  - 使用AXIOS進行API呼叫，封裝在服務層
  - 使用Vue的錯誤邊界處理錯誤
  - 使用Jest或Vue Test Utils進行單元測試
- 監視多組數據時，使用watchEffect
- 函式用function(){ }盡量不使用箭頭函式
- 共通引用的import
import { ref, onMounted } from 'vue'
import { useAxiosStore } from '@/stores/useAxiosStore'
import { useLoginInfoStore } from '../stores/useLoginInfoStore'
import Swal from 'sweetalert2'
import type {
  DataRs,
  Para,
  ParaRs,
} from '@/types/Models'
- 共同使用的參數
const axios = useAxiosStore().createAxiosInstance()
const loginStore = useLoginInfoStore()
