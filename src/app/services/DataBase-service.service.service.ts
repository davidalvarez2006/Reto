import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  mensajes = ['hoalaalalalalalalallla','adisososooooso']

  constructor() {
    console.log('Data: ' + this.mensajes);

  }

}
