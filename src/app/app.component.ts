import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/Historial-sideBar/Historial-sideBar.component';
import { ChatHistorialComponent } from './components/chat-historial/chat-historial.component';
import { ChatTextbarComponent } from './components/chat-textbar/chat-textbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    SidebarComponent,
    ChatHistorialComponent,
    ChatTextbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reto';
  mensajesGuardados: { texto: string; tipo: 'usuario' | 'bot' }[] = [];

  recibirMensaje(mensaje: { texto: string; tipo: 'usuario' | 'bot' }) {
    this.mensajesGuardados = [...this.mensajesGuardados, mensaje];
    console.log('Actualizados:', this.mensajesGuardados);
  }
}
