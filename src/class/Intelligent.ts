import { IntelligentInterface } from "../interface/IntelligentInterface";
import ModelAPIInterface from "../interface/ModelAPIInterface";
import { ChatManage } from "./ChatManage";
import { MCPControlCenter } from "./MCPFunction";
import { OpenAPIModel } from "./OpenAPIModel";

export class FillModelForm {
  public apiCompany: string;
  public modelName: string;
  public submitModelForm(): ModelAPIInterface {
    switch (this.apiCompany) {
      case "GPT":
        const openAPIModel = new OpenAPIModel();
        openAPIModel.GPTModel = this.modelName;
        return openAPIModel;
      case "Bard":
        break;
      case "Claude":
        break;
      default:
        console.error("Unknown AI company");
    }
  }
}
export class Intelligent implements IntelligentInterface {
  private modelAPIInterface: ModelAPIInterface
  private mcpControlCenter: MCPControlCenter
  public chat: ChatManage
  constructor(){
    this.chat = new ChatManage()
    this.mcpControlCenter = new MCPControlCenter()
  }
  public subscribeModelAPI(form: FillModelForm) {
    console.log("Start to subscribe Model API!");
    this.modelAPIInterface = form.submitModelForm()
    this.mcpControlCenter = new MCPControlCenter()
    this.chat.connect(this.modelAPIInterface)
    this.chat.podcasting()
  }
  public cancelSubscribeModelAPI(): void{
    console.log("Cancel to subscribe Model API!");
    this.modelAPIInterface = null
    this.chat.disconnect()
    this.mcpControlCenter = null
  }
  public async executeModelAPI(prompt: string, instructions: string): Promise<void> {
    if(!this.modelAPIInterface){
      console.error("Not subscribed yet...")
      return
    }
    console.log("Start execute Model API!");
    this.modelAPIInterface.Prompt = prompt
    this.modelAPIInterface.Instructions = instructions
    this.handleAPIResponse(await this.modelAPIInterface.askModelToChooseFunction())
    this.modelAPIInterface.giveModelMCPExecuteRecord(this.mcpControlCenter.mcpRecord)
    await this.modelAPIInterface.askModelToReturnMessage()
  }
  private handleAPIResponse(response: any) {
    try {
      this.mcpControlCenter.classifyAndCallAPIReturnFunction(response)
    } catch (error) {
      console.error(error)
    }
  }
}
