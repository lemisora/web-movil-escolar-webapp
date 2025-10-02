import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss'],
  standalone: false
})
export class RegistroAdminComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public admin: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token :string = "";
  public idUser: number = 0;
  
  // Para las contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = "password";
  public inputType_2: string = "password";
  
  constructor(
    private location: Location,
    // private administradoresService: AdministradoresService,
    public acivatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  // Funciones para contraseña
  public showPassword() { 
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else { 
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }
  
  public showPwdConfirmar() { 
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else { 
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar() { 
    this.location.back();
  }
  
  public registrar() { }
  
  public actualizar() { }
  
  public soloLetras(event: KeyboardEvent) { 
    const charCode = event.key.charCodeAt(0);
    if (
      ! (charCode < 65 || charCode > 90) && // Letras mayúsculas
      ! (charCode > 97 && charCode < 122 ) && // Letras minúsculas
      ! (charCode !== 32) // Espacio
    ) { 
      event.preventDefault();
    }
  }
  
}
