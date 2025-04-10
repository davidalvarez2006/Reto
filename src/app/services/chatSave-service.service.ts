import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.loadConversations();
  }

  // Se llama en el constructor para obtener la lista inicial de conversaciones
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

  // <-- Nuevo método para recargar las conversaciones desde el backend
  public fetchConversations(): void {
    this.http.get<Conversation[]>(this.apiUrl).subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.conversationsSubject.next(this.conversations);
      },
      error: (error) => {
        console.error('Error al recargar las conversaciones', error);
      }
    });
  }

  // Modificado para devolver un Observable con la conversación guardada.
  addConversation(title: string, messages: Message[]): Observable<Conversation> {
    const newConversation: Conversation = { id: 0, title, messages };
    return this.http.post<Conversation>(`${this.apiUrl}/add`, newConversation);
  }

  addMessageToConversation(conversationId: number, message: Message) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.push(message);
      this.http.put(`${this.apiUrl}/update/${conversationId}`, conversation).subscribe({
        next: (response) => {
          console.log('Mensaje actualizado en la base de datos', response);
          this.updateConversations();
        },
        error: (error) => {
          console.error('Error al actualizar la conversación', error);
        }
      });
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

  clearConversations(): void {
    this.conversations = [];
    this.conversationsSubject.next(this.conversations);
    localStorage.removeItem('conversations');
  }

  private updateConversations() {
    this.conversationsSubject.next(this.conversations);
  }
}
