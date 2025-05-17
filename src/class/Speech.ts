import * as speechSDK from "microsoft-cognitiveservices-speech-sdk";
import SpeechToolInterface from "../interface/SpeechToolInterface";
enum channel {
  mono = 1,
  stereo = 2,
}
export default class SpeechTool implements SpeechToolInterface {
  private contentNoFix: string = "";
  private contentFix: string = "";
  private content: string = "";
  private readonly speechKey: string = "bb17921d423e41898123a354ae8432ec";
  private readonly speechRegion: string = "japanwest";
  private readonly speechLanguage: string = "zh-TW"; // 語音辨識語言
  private audioConfigureMicrophone =
    speechSDK.AudioConfig.fromDefaultMicrophoneInput();
  private speechTranslationConfig =
    speechSDK.SpeechTranslationConfig.fromSubscription(
      this.speechKey,
      this.speechRegion
    );
  private speechConfig = speechSDK.SpeechConfig.fromSubscription(
    this.speechKey,
    this.speechRegion
  );
  private recognizer: speechSDK.SpeechRecognizer;
  constructor() {
    this.speechConfig.speechRecognitionLanguage = this.speechLanguage; // 語音辨識語言
    this.speechTranslationConfig.speechRecognitionLanguage =
      this.speechLanguage; // 設定識別語言為繁體中文
    this.speechTranslationConfig.addTargetLanguage("en"); // 設定目標翻譯語言為英語
  }
  public get getContentFix(): string {
    return this.contentFix;
  }
  public get getContentNoFix(): string {
    return this.contentNoFix;
  }
  public get getContent(): string {
    return this.content;
  }
  public async fromWavSTT(FileArrayBuffer: ArrayBuffer): Promise<void> {
    console.log("開始錄音轉換");
    //建立 audio stream format：16kHz, 16bit, mono
    const audioFormat = speechSDK.AudioStreamFormat.getWaveFormatPCM(
      16000,
      16,
      1
    );
    const pushStream = speechSDK.AudioInputStream.createPushStream(audioFormat);
    let pcmBuffer = FileArrayBuffer;
    if (!this.checkWavConformAzureFormat(FileArrayBuffer)) {
      console.log("WAV 檔案格式不正確！需要轉換格式。");
      pcmBuffer = await this.convertWavToRawPCM(FileArrayBuffer);
    }
    // push it to the push stream.
    pushStream.write(pcmBuffer);
    pushStream.close();
    const audioConfig = speechSDK.AudioConfig.fromStreamInput(pushStream);
    this.recognizer = new speechSDK.SpeechRecognizer(
      this.speechConfig,
      audioConfig
    );
    return new Promise((resolve, reject) => {
      this.recognizer.recognizeOnceAsync(
        (result: any) => {
          this.content = result.text;
          resolve(result.text);
        },
        (err: any) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }
  public fromMicrophoneSTT(onRecognized?: (text: string) => void): void {
    console.log("開始錄音轉換");
    this.recognizer = new speechSDK.SpeechRecognizer(
      this.speechConfig,
      this.audioConfigureMicrophone
    );
    this.recognizer.startContinuousRecognitionAsync();
    this.recognizer.recognizing = (s: any, e: any) => {
      // 錄音分析漸變
      console.log("辨識: " + e.result.text);
      console.log("偏移量: " + e.result.offset);
      console.log("持續時間: " + e.result.duration);
      this.contentNoFix = this.contentFix;
      this.contentNoFix += e.result.text;
    };

    this.recognizer.recognized = (s: any, e: any) => {
      if (e.result.reason == speechSDK.ResultReason.RecognizedSpeech) {
        console.log(`已識別：文字=${e.result.text}`);
        this.contentFix += e.result.text;
        if (onRecognized) {
          onRecognized(e.result.text);
        }
      } else if (e.result.reason == speechSDK.ResultReason.NoMatch) {
        console.log("NOMATCH：無法辨識語音。");
      }
    };

    this.recognizer.canceled = (s: any, e: any) => {
      console.log(`取消：原因=${e.reason}`);

      if (e.reason == speechSDK.CancellationReason.Error) {
        console.log(`已取消：錯誤代碼=${e.errorCode}`);
        console.log(`已取消：錯誤詳細訊息=${e.errorDetails}`);
        console.log("已取消：您是否設定了語音資源鍵和區域值?");
      }

      this.recognizer.stopContinuousRecognitionAsync();
    };

    this.recognizer.sessionStopped = (s: any, e: any) => {
      console.log("會話停止事件");
      this.recognizer.stopContinuousRecognitionAsync();
    };
  }
  public stopRecord() {
    console.log("停止錄音");
    this.recognizer.stopContinuousRecognitionAsync();
  }
  // 音訊轉換函式
  public async convertWavToRawPCM(
    FileArrayBuffer: ArrayBuffer
  ): Promise<ArrayBuffer> {
    console.info("轉換 WAV 檔案為 PCM 格式");
    const audioContext = new AudioContext();
    const arrayBuffer = FileArrayBuffer;
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const offlineCtx = new OfflineAudioContext({
      numberOfChannels: 1,
      length: audioBuffer.duration * 16000,
      sampleRate: 16000,
    });

    const source = offlineCtx.createBufferSource();
    const monoBuffer = audioContext.createBuffer(
      1,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    const channelData = monoBuffer.getChannelData(0);

    if (audioBuffer.numberOfChannels === 2) {
      const ch0 = audioBuffer.getChannelData(0);
      const ch1 = audioBuffer.getChannelData(1);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = (ch0[i] + ch1[i]) / 2;
      }
    } else {
      channelData.set(audioBuffer.getChannelData(0));
    }

    source.buffer = monoBuffer;
    source.connect(offlineCtx.destination);
    source.start();

    const renderedBuffer = await offlineCtx.startRendering();
    const float32 = renderedBuffer.getChannelData(0);

    const pcmBuffer = new ArrayBuffer(float32.length * 2);
    const view = new DataView(pcmBuffer);
    for (let i = 0; i < float32.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32[i]));
      view.setInt16(i * 2, sample * 0x7fff, true);
    }
    console.info("結束轉換 WAV 檔案為 PCM 格式");
    return pcmBuffer;
  }
  public checkWavConformAzureFormat(FileArrayBuffer: ArrayBuffer): boolean {
    const dataView = new DataView(FileArrayBuffer);
    const sampleRate = dataView.getUint32(24, true);
    const numChannels = dataView.getUint16(22, true);
    const bitDepth = dataView.getUint16(34, true);
    console.log(
      `Sample Rate: ${sampleRate}, Channels: ${numChannels}, Bit Depth: ${bitDepth}`
    );
    if (sampleRate !== 16000) {
      console.log("錯誤：取樣率不正確，應為 16000 Hz");
      return false;
    }
    if (numChannels !== channel.mono) {
      console.log("錯誤：通道數不正確，應為單聲道");
      return false;
    }
    if (bitDepth !== 16) {
      console.log("錯誤：位元深度不正確，應為 16 位元");
      return false;
    }
    console.log("WAV 檔案格式正確！");
  }
  public textToSpeech(text: string): Promise<Blob> {
    this.speechConfig.speechSynthesisVoiceName = "zh-CN-YunxiNeural";
     return new Promise((resolve, reject) => {
      //自動撥放置默認的喇叭設定，如果為null就部會自動撥放音訊。
      //const audioConfig = speechSDK.AudioConfig.fromDefaultSpeakerOutput();
      const audioConfig = null;
      const synthesizer = new speechSDK.SpeechSynthesizer(
        this.speechConfig,
        audioConfig
      );
      synthesizer.speakTextAsync(
        text,
        (result: any) => {
          if (result.reason === speechSDK.ResultReason.SynthesizingAudioCompleted) {
            console.log("語音合成完成。");
            // 將 audioData 轉成 Blob
            const audioBlob = new Blob([result.audioData], { type: "audio/wav" });
            synthesizer.close();
            resolve(audioBlob);
          } else {
            synthesizer.close();
            console.error("語音合成失敗。", result.errorDetails);
            reject(result.errorDetails);
          }
          
        },
        (error: any) => {
          console.error("語音合成錯誤。", error);
          reject(error);
          synthesizer.close();
        }
      );
    });
  }
}
