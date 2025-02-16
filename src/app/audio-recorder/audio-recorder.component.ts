import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-audio-recorder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-recorder.component.html',
  styleUrl: './audio-recorder.component.scss'
})
export class AudioRecorderComponent {

  title = 'audio-record';
  record: any;
  recording = false;
  url: any;
  error: any;

  constructor(private domSanitizer: DomSanitizer) {}

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  startRecording() {
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
    var options: RecordRTC.Options = {
      mimeType: 'audio/wav' as 'audio/wav'
    };
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  processRecording(blob: Blob | MediaSource) {
    this.url = URL.createObjectURL(blob);
    console.log('blob', blob);
    console.log('url', this.url);
  }

  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }

}
