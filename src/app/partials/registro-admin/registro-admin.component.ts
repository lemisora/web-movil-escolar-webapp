import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FacadeService } from "src/app/services/facade.service";
import { Location } from "@angular/common";
import { AdministradoresService } from "src/app/services/administradores.service";

@Component({
  selector: "app-registro-admin",
  templateUrl: "./registro-admin.component.html",
  styleUrls: ["./registro-admin.component.scss"],
  standalone: false,
})
export class RegistroAdminComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public admin: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";
  public idUser: number = 0;

  // Para las contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = "password";
  public inputType_2: string = "password";

  constructor(
    private location: Location,
    private administradoresService: AdministradoresService,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Validar si cuenta con un token de inicio de sesión
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID del usuario", this.idUser);
      this.admin = this.datos_user;
    } else { 
      this.admin = this.administradoresService.esquemaAdmin();
      this.admin.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    // Imprimir datos en consola
    console.log("Datos del usuario", this.admin);
  }

  // Funciones para contraseña
  public showPassword() {
    if (this.inputType_1 == "password") {
      this.inputType_1 = "text";
      this.hide_1 = true;
    } else {
      this.inputType_1 = "password";
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar() {
    if (this.inputType_2 == "password") {
      this.inputType_2 = "text";
      this.hide_2 = true;
    } else {
      this.inputType_2 = "password";
      this.hide_2 = false;
    }
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(
      this.admin,
      this.editar,
    );
    if (Object.keys(this.errors).length > 0) {
      return false;
    }
    
    // Validar que las contraseñas ingresadas coincidan
    if (this.admin.password !== this.admin.confirmar_password) { 
      alert("Las contraseñas no coinciden");
      return false;
    }
    
    // Se consume el servicio para el registro de administradores
    this.administradoresService.registrarAdmin(this.admin).subscribe({
      next: (response: any) => { 
        alert("Administrador registrado exitosamente");
        console.log("Admin registrado",response);
        //  Si se logró validar se va a lista de administradores
        if (this.token != "") {
          this.router.navigate(["administrador"]);
        } else { 
          this.router.navigate(["/"]);
        }
        
      },
      error: (error: any) => { 
        if (error.status === 422) {
          this.errors = error.error.errors;
        } else { 
          alert("Error al registrar el administrador");
        }
      }
    });
  }

  public actualizar() {}

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);

    // Permitir solo letras (mayúsculas y minúsculas) y espacio

    if (
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32 // Espacio
    ) {
      event.preventDefault();
    }
  }
}
