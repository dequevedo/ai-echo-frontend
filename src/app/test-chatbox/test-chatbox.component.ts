import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-test-chatbox',
  standalone: true,
  imports: [CommonModule],
  providers: [ChatService],
  templateUrl: './test-chatbox.component.html',
  styleUrl: './test-chatbox.component.scss'
})
export class TestChatboxComponent implements OnInit{

  title = 'audio-record';
  record: any;
  recording = false;
  audioUrl: any;
  error: any;
  private RecordRTC: any;

  userMessage = 'Tell me a very very short story about a frog';
  responseMessage = '';

  constructor(private domSanitizer: DomSanitizer, private chatService: ChatService) {}

  async ngOnInit() {
    // Importa RecordRTC apenas no cliente
    if (typeof window !== 'undefined') {
      const RecordRTC = await import('recordrtc');
      this.RecordRTC = RecordRTC.default || RecordRTC;
    }
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  async startRecording() {
    if (!this.RecordRTC) {
      console.error('RecordRTC não foi carregado corretamente.');
      return;
    }

    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };

    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream: any) {
    if (!this.RecordRTC) {
      console.error('RecordRTC não foi carregado corretamente.');
      return;
    }

    var options = {
      mimeType: 'audio/wav' as 'audio/wav'
    };
    var StereoAudioRecorder = this.RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    if (!this.record) {
      console.error('Nenhuma gravação em andamento.');
      return;
    }

    this.record.stop((blob: Blob) => {
      this.processRecording(blob);

      // Para liberar os recursos do MediaStream
      if (this.record.stream) {
        this.record.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }

      // Resetando para evitar chamadas inválidas
      this.record = null;
      this.recording = false;
    });

    this.sendMessage();
  }

  processRecording(blob: Blob | MediaSource) {
    this.audioUrl = window.URL.createObjectURL(blob);
    console.log('blob', blob);
    console.log('url', this.audioUrl);
  }

  errorCallback(_error: any) {
    this.error = 'Can not play audio in your browser';
  }

  sendMessage() {
    // if (!this.userMessage.trim()) return;

    this.chatService.sendMessage(this.userMessage).subscribe(
      (response) => {
        this.responseMessage = response.message; // Supondo que o backend retorna um campo `message`
        this.userMessage = ''; // Limpa o campo de input
        console.log(response.message);
      },
      (error) => {
        console.error('Erro ao enviar mensagem:', error);
      }
    );
  }
}
