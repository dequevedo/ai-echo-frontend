import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseHost = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  sendChat(message: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' });
    const body = { message };

    return this.http.post<any>(`${this.baseHost}/chat`, body, { headers });
  }

  sendAudioToText(audioFile: Blob): Observable<any> {
    if (!audioFile || audioFile.size === 0) {
      console.error('Erro: Nenhum áudio válido foi capturado.');
      return new Observable(observer => {
        observer.error('Nenhum áudio válido foi capturado.');
      });
    }

    console.log('Enviando áudio para transcrição...', audioFile);

    const formData = new FormData();
    formData.append('file', audioFile, 'audio.wav');

    return this.http.post<any>(`${this.baseHost}/voice-to-text`, formData);
  }

}
