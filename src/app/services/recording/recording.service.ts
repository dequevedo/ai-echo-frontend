import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordingService {
  private RecordRTC: any;
  private record: any;
  private stream!: MediaStream;
  private recordingSubject = new Subject<Blob>();

  constructor() {
    this.loadRecordRTC();
  }

  private async loadRecordRTC() {
    if (typeof window !== 'undefined') {
      const RecordRTC = await import('recordrtc');
      this.RecordRTC = RecordRTC.default || RecordRTC;
    }
  }

  async startRecording(): Promise<void> {
    if (!this.RecordRTC) {
      console.error('RecordRTC não foi carregado corretamente.');
      return;
    }

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

  async stopRecording(): Promise<void> {
    if (!this.record) {
      console.error('Nenhuma gravação em andamento.');
      return;
    }

    try {
      this.record.stop((blob: Blob) => {
        if (!blob) {
          console.error('Erro: Blob inválido.');
          return;
        }

        this.recordingSubject.next(blob);
        this.stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Erro ao parar a gravação:', error);
    }
  }

  getRecording(): Observable<Blob> {
    return this.recordingSubject.asObservable();
  }
}
