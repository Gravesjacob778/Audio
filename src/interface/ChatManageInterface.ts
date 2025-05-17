
import ModelAPIInterface from "./ModelAPIInterface";

export interface  ChatManageInterface{
    connect(model: ModelAPIInterface): void
    disconnect(): void
    podcasting(): void
}