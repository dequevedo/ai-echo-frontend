import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-recorder.component.html',
  styleUrl: './audio-recorder.component.scss'
})
export class AudioRecorderComponent implements OnInit {

  title = 'audio-record';
  record: any;
  recording = false;
  audioUrl: any;
  error: any;
  private RecordRTC: any; // Variável para armazenar a referência do RecordRTC

  constructor(private domSanitizer: DomSanitizer) {}

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
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  processRecording(blob: Blob | MediaSource) {
    this.audioUrl = window.URL.createObjectURL(blob);
    console.log('blob', blob);
    console.log('url', this.audioUrl);
  }

  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }
}
