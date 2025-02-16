import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from '../services/chat/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ChatService],
  templateUrl: './test-chatbox.component.html',
  styleUrl: './test-chatbox.component.scss'
})
export class TestChatboxComponent implements OnInit {
  inputText: string = '';
  
  speechAudioUrl: any; // Armazena o áudio convertido

  title = 'audio-record';
  recording = false;
  audioUrl: any;
  private RecordRTC: any;
  private record: any;
  private stream!: MediaStream;

  constructor(private domSanitizer: DomSanitizer, private chatService: ChatService) {}

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const RecordRTC = await import('recordrtc');
      this.RecordRTC = RecordRTC.default || RecordRTC;
    }
  }

  async startRecording() {
    if (!this.RecordRTC) {
      console.error('RecordRTC não foi carregado corretamente.');
      return;
    }

    this.recording = true;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.record = new this.RecordRTC.StereoAudioRecorder(this.stream, {
        mimeType: 'audio/wav',
        numberOfAudioChannels: 1,
        sampleRate: 44100
      });

      this.record.record();
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
    }
  }

  async stopRecording() {
    if (!this.record) {
      console.error('Nenhuma gravação em andamento.');
      return;
    }

    this.recording = false;

    try {
      this.record.stop((blob: Blob) => {
        if (!blob) {
          console.error('Erro: Blob inválido.');
          return;
        }

        this.audioUrl = URL.createObjectURL(blob);
        this.sendAudioToText(blob);

        this.stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Erro ao parar a gravação:', error);
    }
  }

  sendAudioToText(blob: Blob) {
    this.chatService.sendAudioToText(blob).subscribe(
      (response) => {
        console.log('Resposta da transcrição:', response);
        this.inputText = response.text || response;
        this.convertTextToSpeech();
      },
      (error) => console.error('Erro ao enviar áudio:', error)
    );
  }

  convertTextToSpeech() {
    if (!this.inputText.trim()) {
      console.error('Erro: Nenhum texto para conversão.');
      return;
    }

    this.chatService.sendTextToVoice(this.inputText).subscribe(
      (audioBlob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        this.speechAudioUrl = audioUrl;

        console.log('Áudio gerado:', audioUrl);

        const audio = new Audio(audioUrl);
        audio.play();
      },
      (error) => console.error('Erro ao converter texto para voz:', error)
    );
  }
}
