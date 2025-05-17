export default interface ModelBaseAPIInterface {
  set Prompt(prompt: string) // 設定提示
  get Prompt():string
  set Temperature(temperature: number) // 設定溫度
  get Temperature(): number
  set MaxTokens(maxTokens: number) // 設定最大回傳 token 數
  get MaxTokens(): number
  set Timeout(timeout: number) // 設定請求逾時時間
  get Timeout(): number
  set Instructions(instructions: string) // 設定指令
  get Instructions(): string
  get AICompany(): string
  set ModelName(modelName: string)
  get ModelName() : string
}
