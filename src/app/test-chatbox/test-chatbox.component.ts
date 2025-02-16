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
export class TestChatboxComponent implements OnInit {
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

      this.record.record(); // 🔥 Corrigido: Método correto para iniciar a gravação
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
      this.record.stop((blob: Blob) => { // 🔥 Corrigido: Método correto para parar a gravação e obter o Blob
        if (!blob) {
          console.error('Erro: Blob inválido.');
          return;
        }

        this.audioUrl = URL.createObjectURL(blob);
        this.sendAudioToText(blob);

        // Libera os recursos do microfone
        this.stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Erro ao parar a gravação:', error);
    }
  }

  sendAudioToText(blob: Blob) {
    this.chatService.sendAudioToText(blob).subscribe(
      (response) => console.log('Resposta da transcrição:', response),
      (error) => console.error('Erro ao enviar áudio:', error)
    );
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
}
