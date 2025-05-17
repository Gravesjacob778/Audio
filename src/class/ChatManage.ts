import { ChatManageInterface } from "@/interface/ChatManageInterface";
import { Dialog } from "@/interface/Dialog";
import ModelAPIInterface from "@/interface/ModelAPIInterface";
import { ref } from 'vue'

export class ChatManage implements ChatManageInterface {
    private static chatHistory = ref<Dialog[]>([])
    private  modelAPI: ModelAPIInterface // 模型API
    private  permitListen: Boolean = false

    public connect(model: ModelAPIInterface): void{
        console.log(`Start to wiretap the ${model.AICompany} model API!`);
        this.modelAPI = model;
        this.permitListen = true
    }
    public disconnect() :void{
        console.log("Stop to listen conversation...")
        this.modelAPI = null
        this.permitListen = false
        ChatManage.chatHistory.value = []
    }
    public async podcasting(){
        let currentLength = 0
        if (!this.modelAPI){
            console.error("No model connect, please check model...")
            return 
        }
        console.log('Podcasting with AI!!')

        while(this.permitListen){
            if (this.modelAPI.CallUpMessageToUser.length != 0 && this.modelAPI.CallUpMessageToUser.length != currentLength){
                ChatManage.chatHistory.value = [...this.modelAPI.CallUpMessageToUser]
                currentLength = ChatManage.chatHistory.value.length
            }

            await new Promise(function(resolve) { 
                setTimeout(resolve, 1000) 
            })
        }
        console.log('Podcasting end!!')
    }
    public get ChatHistory(): Dialog[]{
        return ChatManage.chatHistory.value
    }
}