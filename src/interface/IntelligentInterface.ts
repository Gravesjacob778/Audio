import { ChatManage } from "@/class/ChatManage";
import { FillModelForm } from "../class/Intelligent";
export interface IntelligentInterface {
    chat: ChatManage
    subscribeModelAPI(form: FillModelForm) : void // 設定模型
    executeModelAPI(prompt: string, instructions: string) : Promise<void> // 執行模型
    cancelSubscribeModelAPI(): void
}