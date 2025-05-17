import OpenAI from "openai";
import ModelAPIInterface from "../interface/ModelAPIInterface";
import { ModelBaseAPI } from "./ModelBaseAPI";
import { FunctionTool } from "openai/resources/responses/responses";
import { Dialog } from "@/interface/Dialog";
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
enum ModelAction {
  ASK_Model_To_Choose_Function = 1,
  ASK_MODEL_TO_RETURN_MESSAGE = 2,
}
export class OpenAPIModel extends ModelBaseAPI implements ModelAPIInterface {
  private messageObjForGPT: Array<any> = new Array<any>();
  private messageForUser: Array<Dialog> = new Array<Dialog>();
  constructor() {
    super();
    this.init();
  }
  private init() {
    console.log("OpenAPIModel init");
    const tool: FunctionTool = {
      type: "function",
      name: "search_employee_from_database",
      description: "A tool that can be used to call functions",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "employee id",
          },
        },
      },
      strict: false,
    };
    this.model = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
    this.ai = "GPT";
    this.modelName = "";
    this.tools.push(tool);
    this.Timeout = 30000;
    this.Prompt = "";
    this.Temperature = 0.7;
    this.MaxTokens = 1000;
  }
  public set GPTModel(modelName: string) {
    this.modelName = modelName;
  }
  public get CallUpMessageToUser(): any[] {
    return this.messageForUser;
  }
  public giveModelMCPExecuteRecord(record: any[]): void {
    for (const item of record) {
      this.messageObjForGPT.push(item);
    }
  }
  public askModelToChooseFunction(): Promise<string | null> {
    console.log("Asking GPT to choose a function...");
    return this.create(ModelAction.ASK_Model_To_Choose_Function);
  }
  public askModelToReturnMessage(): Promise<string | null> {
    console.log("Asking GPT to response full message...");
    return this.create(ModelAction.ASK_MODEL_TO_RETURN_MESSAGE);
  }
  private async create(action: ModelAction): Promise<any> {
    const model = this.model as OpenAI
    let result: any
    switch (action) {
      case ModelAction.ASK_MODEL_TO_RETURN_MESSAGE:
        result = await model.responses.create({
          model: this.modelName,
          input: this.messageObjForGPT,
          tools: this.tools,
          store: true,
        });
        this.messageObjForGPT.push(result.output[0]);
        this.messageForUser.push({
          role: "AI",
          message: result.output[0].content[0].text,
        });
        break;
      case ModelAction.ASK_Model_To_Choose_Function:
        this.messageObjForGPT = []
        this.messageObjForGPT.push({
          role: "user",
          content: this.Prompt,
        });
        this.messageForUser.push({
          role: "user",
          message: this.Prompt,
        });
        result = await model.responses.create({
          model: this.modelName,
          instructions: this.Instructions,
          temperature: this.Temperature,
          max_output_tokens: this.MaxTokens,
          tools: this.tools,
          input: this.messageObjForGPT,
        });
        
        break;
      default:
        console.error("No match model action");
        break;
    }
    return result;
  }
}
