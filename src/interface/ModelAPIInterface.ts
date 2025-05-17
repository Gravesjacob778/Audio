import ModelBaseAPIInterface from "./ModelBaseAPIInterface";

export default interface ModelAPIInterface extends ModelBaseAPIInterface {
    get CallUpMessageToUser (): any[] // 調撥聊天紀錄
    set GPTModel(modelName: string) // 設定GPT模型名稱
    askModelToChooseFunction(): Promise<any>
    askModelToReturnMessage(): Promise<any>
    giveModelMCPExecuteRecord(record: any[]): void
}