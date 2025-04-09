import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroments/enviroment';

export interface Message {
  texto: string;
  tipo: 'usuario' | 'bot';
}

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatServiceHistorial {
  private conversations: Conversation[] = [];
  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  conversations$ = this.conversationsSubject.asObservable();
  private nextId = 1;
  private apiUrl = `${environment.apiUrl}/conversations`; // URL del backend

  constructor(private http: HttpClient) {
    this.loadConversations();
  }

  private loadConversations() {
    this.http.get<Conversation[]>(this.apiUrl).subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.conversationsSubject.next(this.conversations);
      },
      error: (error) => {
        console.error('Error al cargar las conversaciones', error);
      }
    });
  }

  addConversation(title: string, messages: Message[]): number {
    const newConversation: Conversation = { id: 0, title, messages };
    this.http.post<Conversation>(`${this.apiUrl}/add`, newConversation).subscribe({
      next: (conversation) => {
        this.conversations.push(conversation);
        this.updateConversations();
      },
      error: (error) => {
        console.error('Error al guardar la conversación', error);
      }
    });
    return newConversation.id;
  }

  addMessageToConversation(conversationId: number, message: Message) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.push(message);
      this.http.put(`${this.apiUrl}/update/${conversationId}`, conversation).subscribe({
        next: (response) => {
          console.log('Mensaje actualizado en la base de datos', response);
        },
        error: (error) => {
          console.error('Error al actualizar la conversación', error);
        }
      });
      this.updateConversations();
    }
  }

  getConversationById(id: number): Conversation | undefined {
    return this.conversations.find(conversation => conversation.id === id);
  }

  deleteConversation(id: number): void {
    this.conversations = this.conversations.filter(conv => conv.id !== id);
    this.conversationsSubject.next(this.conversations);
    this.http.delete(`${this.apiUrl}/delete/${id}`).subscribe({
      next: (response) => {
        console.log('Conversación eliminada', response);
      },
      error: (error) => {
        console.error('Error al eliminar la conversación', error);
      }
    });
  }

  clearConversations() {
    this.conversations = [];
    this.conversationsSubject.next(this.conversations);
    localStorage.removeItem('conversations');
  }

  private updateConversations() {
    this.conversationsSubject.next(this.conversations);
  }
}
