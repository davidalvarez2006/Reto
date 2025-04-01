import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatHistorialComponent } from "../../components/chat-historial/chat-historial.component";
import { ChatTextbarComponent } from "../../components/chat-textbar/chat-textbar.component";
import {SidebarComponent } from "../../components/Historial-sideBar/Historial-sideBar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal-page',
  imports: [ChatHistorialComponent, ChatTextbarComponent, SidebarComponent, ChatHistorialComponent, CommonModule],
  templateUrl: './principal-page.component.html',
  styleUrl: './principal-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalPageComponent {
  mensajesGuardados: { texto: string; tipo: 'usuario' | 'bot' }[] = [];

  recibirMensaje(mensaje: { texto: string; tipo: 'usuario' | 'bot' }) {
    try {
      const parsedResponse = JSON.parse(mensaje.texto); // Intentar parsear

      // Si el JSON tiene la propiedad "answare", la usamos en el historial
      if (parsedResponse.answare) {
        this.mensajesGuardados.push({ texto: parsedResponse.answare, tipo: 'bot' });
      } else {
        this.mensajesGuardados.push(mensaje); // Si no es JSON, guardar normal
      }
    } catch (error) {
      // Si no se puede parsear, lo guardamos tal cual
      this.mensajesGuardados.push(mensaje);
    }
    console.log('Mensaje guardado:', mensaje);
  }
 }
