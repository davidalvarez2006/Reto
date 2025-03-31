import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://chat.google.com/room/AAAAZR18C_A/KiUs842A2Nc/KiUs842A2Nc?cls=10'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  // Enviar mensaje al backend
  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, { message });
  }

  // Recibir mensajes (puedes usar polling o WebSockets)
  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages`);
  }
}

