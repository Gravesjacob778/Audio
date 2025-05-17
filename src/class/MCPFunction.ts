import { MCPFunctionInterface, MCPControlCenterInterface, FunctionClassInterface } from "../interface/MCPFunctionInterface";
import { DataBase } from "./DataBase";
enum source {
    DATABASE = 'database',
    WEB = 'web'
} 
export class MCPFunction implements MCPFunctionInterface{
    public parameter: any;
    public class: FunctionClassInterface;
    public functionName : string;
    public exec: Function;
    
    /** 綁定functionName對應的函式到exec */
    public bindExecFunction(): MCPFunction {
        // 取得class物件所有自有屬性（包含方法）
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this.class));
        // 檢查是否有functionName對應的方法
        if (methodNames.includes(this.functionName) && typeof this.class[this.functionName] === 'function') {
            // 綁定exec
            this.exec = this.class[this.functionName].bind(this.class, this.parameter);
        } else {
            // 若找不到對應方法，給予提示
            console.error(`找不到名稱為 ${this.functionName} 的函式於class中`);
        }
        return this
    }
}
export class MCPControlCenter implements MCPControlCenterInterface {
    private record: Array<any> = new Array<any>()
    private readonly ACTION: number = 0
    private readonly INFO: number = 1
    private readonly SOURCE: number = 3
    public classifyAndCallAPIReturnFunction(resources: any): void {
        console.log("Classify API return function!");
        for (const resource of resources.output) {
            if (resource.type != "function_call") {
                continue;
            }
            let standByFunction = new MCPFunction()
             // 切分function名稱
            let splitName = (resource.name as string).split('_');
            // 檢查格式是否正確
            if (!this.check(splitName)) {
                console.error("function name格式錯誤:", resource.name);
                continue;
            }

            this.broadcast(splitName[this.ACTION], splitName[this.INFO], splitName[this.SOURCE])

            if (splitName[this.SOURCE].toLocaleLowerCase() === source.DATABASE.toLocaleLowerCase()){
                standByFunction.class = new DataBase()
                standByFunction.parameter = JSON.parse(resource.arguments)
                standByFunction.functionName = resource.name
                standByFunction = standByFunction.bindExecFunction()
            } else if (splitName[this.SOURCE].toLocaleLowerCase() === source.WEB.toLocaleLowerCase()){
                //Todo
            }
           
            const result = this.callFunction(standByFunction)
            this.writeDownMCPExecuteRecord(resource, result)
        }
        console.log("Finish to execute function!")
    }
    private callFunction(mcp: MCPFunctionInterface){
        console.log("Start to execute function!")
        return mcp.exec()
    }
    private check(splitName: any){
        if (splitName.length < 4 || splitName[2] !== "from"){
            return false;
        } else {
            return true;
        }
    }
    private broadcast(action:string, info: string, source: string){
        console.info(`Prepare to ${action} ${info} from ${source} !`);
    }
    private writeDownMCPExecuteRecord(resource: any, result: any) : void{
        this.record = []
        this.record.push(resource)
        this.record.push({
            type: "function_call_output",
            call_id: resource.call_id,
            output: result.toString()
        })
    }
    public get mcpRecord(){
        return this.record
    }
}