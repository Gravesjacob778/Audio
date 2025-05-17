import { Tool } from "openai/resources/responses/responses";
import ModelBaseAPIInterface from "../interface/ModelBaseAPIInterface";
export class ModelBaseAPI implements ModelBaseAPIInterface {
    protected ai: string |'GPT' | 'Claude' | 'Bard' | 'LLaMA' | 'Mistral' | 'Gemini' | 'Anthropic' | 'Cohere' | 'Jasper' | 'ChatGPT';
    protected modelName: string
    protected model: any;
    protected tools: Array<Tool> = [];
    private timeout: number // 請求逾時時間
    private prompt: string // 輸入提示
    private temperature: number // 溫度參數
    private maxTokens: number // 最大回傳 token 數
    private instructions: string // 指令

  protected set ModelName(modelName: string) {
    this.model = modelName
  }   
  public get ModelName() :string{
    return this.modelName
  }
  public get AICompany(): string {
    // Implement the get BaseModelName method
    return this.ai;
  }
  protected set Prompt(prompt: string) {
    // Implement the set Prompt method
    this.prompt = prompt;
    console.info(`Set prompt to ${prompt}`);
  }
  public get Prompt() {
    // Implement the get Prompt method
    return this.prompt;
  }
  protected set Temperature(temperature: number) {
    // Implement the set Temperature method
    this.temperature = temperature;
    console.info(`Set temperature to ${temperature}`);
  }
  public get Temperature() {
    // Implement the get Temperature method
    return this.temperature;
  }
  protected set MaxTokens(maxTokens: number) {
    // Implement the set MaxTokens method
    this.maxTokens = maxTokens;
    console.info(`Set max tokens to ${maxTokens}`);
  }
  public get MaxTokens() {
    // Implement the get MaxTokens method
    return this.maxTokens;
  }
  protected set Timeout(timeout: number) {
    // Implement the set Timeout method
    this.timeout = timeout;
    console.info(`Set timeout to ${timeout}`);
  }
  public get Timeout() {
    // Implement the get Timeout method
    return this.timeout;
  }
  protected set Instructions(instructions: string) {
    // Implement the set Instructions method
    this.instructions = instructions;
    console.info(`Set instructions to ${instructions}`);
  }
  public get Instructions() {
    // Implement the get Instructions method
    return this.instructions;
  }
}
