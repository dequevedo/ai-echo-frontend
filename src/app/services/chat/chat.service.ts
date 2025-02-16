import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseHost = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  generateChatResponse(message: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' });
    const body = { message };

    return this.http.post<any>(`${this.baseHost}/chat`, body, { headers });
  }

  transcribeAudio(audioFile: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', audioFile, 'audio.wav');

    return this.http.post<any>(`${this.baseHost}/voice-to-text`, formData);
  }

  convertTextToSpeech(text: string): Observable<Blob> {
    return new Observable(observer => {
      this.generateChatResponse(text).subscribe(
        (response) => {
          const body = { input: response.message };

          this.http.post(`${this.baseHost}/text-to-voice`, body, { responseType: 'blob' }).subscribe(
            (audioBlob) => {
              observer.next(audioBlob);
              observer.complete();
            },
            (error) => observer.error(error)
          );
        },
        (error) => observer.error(error)
      );
    });
  }
}
