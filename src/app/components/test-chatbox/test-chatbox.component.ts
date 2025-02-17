import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat/chat.service';
import { RecordingService } from '../../services/recording/recording.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ChatService, RecordingService],
  templateUrl: './test-chatbox.component.html',
  styleUrl: './test-chatbox.component.scss'
})
export class TestChatboxComponent implements OnInit {
  chatboxTextValue: string = '';
  speechAudioUrl: string | null = null;
  recording = false;
  audioUrl: string | null = null;

  constructor(
    private chatService: ChatService,
    private recordingService: RecordingService
  ) {}

  ngOnInit() {
    this.recordingService.getRecording().subscribe((blob) => {
      this.audioUrl = URL.createObjectURL(blob);
      this.transcribeAudio(blob);
    });
  }

  async startRecording() {
    this.recording = true;
    await this.recordingService.startRecording();
  }

  async stopRecording() {
    this.recording = false;
    await this.recordingService.stopRecording();
  }

  private transcribeAudio(blob: Blob) {
    this.chatService.transcribeAudio(blob).subscribe(
      (response) => {
        this.chatboxTextValue = response.text || response;
        this.convertTextToSpeech();
      },
      (error) => console.error('Erro ao enviar áudio:', error)
    );
  }

  private convertTextToSpeech() {
    if (!this.chatboxTextValue.trim()) return console.error('Erro: Nenhum texto para conversão.');

    this.chatService.convertTextToSpeech(this.chatboxTextValue).subscribe(
      (audioBlob) => {
        this.speechAudioUrl = URL.createObjectURL(audioBlob);
        new Audio(this.speechAudioUrl).play();
      },
      (error) => console.error('Erro ao converter texto para voz:', error)
    );
  }
}
