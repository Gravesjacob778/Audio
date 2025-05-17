import { MCPFunction } from "../class/MCPFunction"

export interface MCPControlCenterInterface {
    get mcpRecord()
    classifyAndCallAPIReturnFunction(resources: any): void
}
export interface MCPFunctionInterface {
    parameter: any
    class: any
    functionName: string 
    exec: Function
    bindExecFunction(): MCPFunction   
}
export interface FunctionClassInterface{
    
}