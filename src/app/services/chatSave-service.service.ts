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
  private apiUrl = `${environment.apiUrl}/conversations`; // Asegúrate de que esta URL esté correcta

  constructor(private http: HttpClient) {
    this.loadConversations();  // Cargar las conversaciones desde la base de datos al inicializar
  }

  // Cargar todas las conversaciones de la base de datos
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

  /**
   * Crea una nueva conversación en la base de datos.
   */
  addConversation(title: string, messages: Message[]): number {
    const newConversation: Conversation = { id: this.nextId++, title, messages };
    this.conversations.push(newConversation);

    // Guardar en la base de datos
    this.http.post(`${this.apiUrl}/add`, newConversation).subscribe({
      next: (response) => {
        console.log('Conversación guardada en la base de datos', response);
      },
      error: (error) => {
        console.error('Error al guardar la conversación', error);
      }
    });

    this.updateConversations();
    return newConversation.id;
  }

  /**
   * Agrega un mensaje a una conversación existente en la base de datos.
   */
  addMessageToConversation(conversationId: number, message: Message) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.push(message);

      // Actualizar la base de datos
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

  /**
   * Obtiene una conversación específica por su ID.
   */
  getConversationById(id: number): Conversation | undefined {
    return this.conversations.find(conversation => conversation.id === id);
  }

  /**
   * Elimina una conversación de la base de datos.
   */
  deleteConversation(id: number): void {
    this.conversations = this.conversations.filter(conv => conv.id !== id);
    this.conversationsSubject.next(this.conversations);

    // Eliminar conversación de la base de datos
    this.http.delete(`${this.apiUrl}/delete/${id}`).subscribe({
      next: (response) => {
        console.log('Conversación eliminada de la base de datos', response);
      },
      error: (error) => {
        console.error('Error al eliminar la conversación', error);
      }
    });
  }

  /**
   * Limpia todas las conversaciones.
   */
  clearConversations() {
    this.conversations = [];
    this.updateConversations();
  }

  /**
   * Actualiza las conversaciones en el observador.
   */
  private updateConversations() {
    this.conversationsSubject.next([...this.conversations]);
  }
}
