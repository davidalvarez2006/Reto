import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MessageService {
  private http = inject(HttpClient);
  apiUrl='https://chatbot-normativa-laboral.azurewebsites.net/Chat/Enviar'
  constructor(){
  }

  llamada(input: string){
    const llamar: prompt = {
      question: input,
    };
    return this.http.post(this.apiUrl, llamar);
  }

}

interface prompt{
  question: string
}
