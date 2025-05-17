export default interface SpeechToolInterface {
    get getContentFix() : string ;
    get getContentNoFix() : string;
    get getContent() : string;
    fromWavSTT(FileArrayBuffer: ArrayBuffer): Promise<void>;
    fromMicrophoneSTT(onRecognized?: (text: string) => void): void;
    stopRecord(): void;
    convertWavToRawPCM (FileArrayBuffer: ArrayBuffer): Promise<ArrayBuffer>;
    checkWavConformAzureFormat(FileArrayBuffer: ArrayBuffer): void;
    textToSpeech(text: string): Promise<Blob>;
}