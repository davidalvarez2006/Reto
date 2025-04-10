import { Routes } from '@angular/router';
import { ChatTextbarComponent } from './components/chat-textbar/chat-textbar.component';
import { ChatHistorialComponent } from './components/chat-historial/chat-historial.component';
import { PrincipalPageComponent } from './pages/principal-page/principal-page.component';

// Definición de rutas de la aplicación
export const routes: Routes = [
  {
    path: '', // Ruta principal
    component: PrincipalPageComponent, // Componente principal que contiene los elementos hijos
    children: [
      {
        path: 'textbar', // Ruta para el componente de la barra de texto del chat
        component: ChatTextbarComponent,
      },
      {
        path: 'chat-historial', // Ruta para el historial del chat
        component: ChatHistorialComponent,
      },
    ]
  },

  {
    path: '**', // Ruta para manejar rutas no definidas
    redirectTo: 'textbar', // Redirige cualquier ruta no definida al path 'textbar'
  }
];
