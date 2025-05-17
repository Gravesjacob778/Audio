import { FunctionClassInterface } from "../interface/MCPFunctionInterface";

export class DataBase implements FunctionClassInterface{
    public search_employee_from_database (parameter: any): any{
        console.log("Searching Employee!")
        console.dir(parameter)
        const temp = {
            id: 123,
            name: 'Chovy',
            sex: 'male',
            department: 'HR'
        }
        return JSON.stringify(temp)
    }
} 