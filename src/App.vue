<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import SpeechTool from "./class/Speech";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/button.css";
import "./assets/chat.css";
import { FillModelForm, Intelligent } from "./class/Intelligent";

const speechTool = new SpeechTool()
const contentFix = ref("")
const contentNoFix = ref("")
const content = ref("")
const userInputText = ref("")
const audioUrl = ref<string | null>(null)
const aiCompany = ref<string>('')
const model = ref<string>('')
const intelligent = new Intelligent()
const fillModelForm = new FillModelForm()
function startMicrophone() {
  speechTool.fromMicrophoneSTT((text) => {
    content.value = text
    userInputText.value = text
  });
}
function stopMicrophone() {
  speechTool.stopRecord();
  contentNoFix.value = speechTool.getContentNoFix;
  contentFix.value = speechTool.getContentFix;
  console.log("辨識結束");
}
function fromFile() {
  fetch("http://localhost:5007/AudioFiles/2.wav")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.arrayBuffer();
    })
    .then(async (arrayBuffer) => {
      await speechTool
        .fromWavSTT(arrayBuffer)
        .then(() => {
          content.value = speechTool.getContent;
        })
        .catch((error) => {
          console.error("Error during speech recognition:", error);
        })
        .finally(() => {
          console.log("辨識結束");
        });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
function startTextToSpeech() {
  speechTool
    .textToSpeech(userInputText.value)
    .then((audioBlob) => {
      console.log("文字轉語音完成");
      audioUrl.value = URL.createObjectURL(audioBlob);
    })
    .catch((error) => {
      console.error("Error during text-to-speech:", error);
    });
}
function send() {
  console.log("Start to Execute Model API");
  intelligent.executeModelAPI(
    userInputText.value,
    "你是一個AI助手，請協助我完成以下任務!"
  );
}
function rest(){
  console.log("Rest all setting!")
  intelligent.cancelSubscribeModelAPI()
  aiCompany.value = ''
  model.value = ''
}
watch(model, (newModel) => {
  if (newModel === '' || newModel === undefined) {
    console.log("Model is empty, stop to subscribe!")
    return
  } else {
    console.log(`Model changed to: ${newModel} , start to subscribe!`)
    fillModelForm.apiCompany = aiCompany.value
    fillModelForm.modelName = newModel
    intelligent.subscribeModelAPI(fillModelForm)
  }
});
</script>

<template id="app">
  <header>
    <div class="wrapper">
      <h1>Azure Speech SDK</h1>
      <h2>語音辨識</h2>
    </div>
  </header>
  <div class="center">
    <i class="fa fa-microphone" style="font-size: 36px"></i>
    <button type="button" class="fill-button" @click="startMicrophone">
      開始辨識
    </button>
    <button type="button" class="fill-button" @click="stopMicrophone">
      停止辨識
    </button>
    <button type="button" class="fill-button" @click="fromFile">
      從檔案辨識
    </button>
    <button type="button" class="fill-button" @click="startTextToSpeech">
      文字轉語音
    </button>
    <div>
      <h3>辨識結果(不修正)</h3>
      <p>{{ contentNoFix }}</p>
      <h3>辨識結果(修正)</h3>
      <p>{{ contentFix }}</p>
      <h3>辨識結果</h3>
      <p>{{ content }}</p>
      <h3>輸入文字換成音檔</h3>
      <div id="chatbox">
        <div class="chat-scroll">
          <template v-for="(msg, index) in intelligent.chat.ChatHistory" :key="index">
            <div v-if="msg.role == 'AI'" class="message">
              <div class="avatar kyros"></div>
              <b style="color:cyan;"> Kyros:</b>
              {{ msg.message }}
            </div>
             <div v-if="msg.role == 'user'" class="message">
              <div class="avatar trev">
              </div>
              <div class="msg-text">
                <b style="color:magenta;">Trev:</b> {{ msg.message }}
              </div>
            </div>
          </template>
        </div>
      <div class="chat-control chat-status">
        <div class="profile-control">
          Trev
        </div>
        <div class="channel-control">
          #main
        </div>
        <div class="help-control">
          help
        </div>
      </div>
      <div class="chat-control chat-input">
        <input v-model="userInputText" type="text" id="chat-input-box"></input>
        <div class="send-button" @click="send">發送</div>
        <div class="emoji-button">😂</div>
      </div>
  </div>
    </div>
  </div>
  <div class="center">
    <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    <div v-else>
      <p>請輸入文字轉換成音檔</p>
    </div>
  </div>
  <div class="footer">
    <div style="width: 20%;padding-right: 20px;">
       <select class="form-control"  v-model="aiCompany">
        <option value="">請選擇AI</option>
        <option value="GPT">GPT</option>
      </select>
    </div>
   <div style="width: 40%;padding-right: 20px;">
      <select class="form-control"  v-model="model">
        <option value="">請選擇模型</option>
        <option value="gpt-3.5-turbo" >gpt-3.5-turbo</option>
        <option value="gpt-4.1-nano-2025-04-14">gpt-4.1-nano-2025-04-14</option>
        <option value="gpt-4.1-2025-04-14">gpt-4.1-2025-04-14</option>
      </select>
   </div>
   <div>
      <button type="button" class="fill-button" @click="rest">
        結束AI聊天
      </button>
   </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  padding-right: 0px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
