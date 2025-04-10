import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) // El servicio estará disponible a nivel global
export class MessageService {
  private http = inject(HttpClient); // Inyectamos el servicio HttpClient de Angular para hacer peticiones HTTP
  private apiUrl = 'https://chatbot-normativa-laboral.azurewebsites.net/Chat/Enviar'; // URL del API del chatbot

  constructor() {
    // No es necesario hacer nada en el constructor por ahora
  }

  /**
   * Realiza una llamada POST al servicio de chatbot con la pregunta del usuario
   * @param input - La pregunta que el usuario ingresa
   * @returns Un observable con la respuesta del chatbot
   */
  llamada(input: string) {
    // Creamos el objeto que se enviará en la solicitud POST
    const llamar: Prompt = {
      question: input, // El campo "question" recibe la pregunta del usuario
    };

    // Realizamos la solicitud POST y retornamos el observable
    return this.http.post<ChatResponse>(this.apiUrl, llamar);
  }
}

// Interface que define el objeto que enviamos al servidor
interface Prompt {
  question: string; // La pregunta del usuario
}

// Interface para la respuesta del chatbot
export interface ChatResponse {
  answer: string; // La respuesta del bot
}
