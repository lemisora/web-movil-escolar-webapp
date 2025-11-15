import { Component, Input, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AlumnosService } from "src/app/services/alumnos.service";
import { FacadeService } from "src/app/services/facade.service";

@Component({
  selector: "app-registro-alumnos",
  templateUrl: "./registro-alumnos.component.html",
  styleUrls: ["./registro-alumnos.component.scss"],
  standalone: false,
})
export class RegistroAlumnosComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public alumno: any = {};
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
    private alumnosService: AlumnosService,
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
      this.alumno = this.datos_user;
    } else { 
      this.alumno = this.alumnosService.esquemaAlumno();
      this.alumno.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    // Imprimir datos en consola
    console.log("Datos del usuario", this.alumno);
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
  
  public changeFecha(event: any) { 
    console.log(event);
    console.log(event.value);
    console.log(event.value.toISOString());
    
    this.alumno.birthdate = event.value.toISOString().split('T')[0];
    console.log("Fecha de nacimiento: ",this.alumno.birthdate);
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(
      this.alumno,
      this.editar,
    );
    if (Object.keys(this.errors).length > 0) {
      return false;
    }
    
    // Validar que las contraseñas ingresadas coincidan
    if (this.alumno.password !== this.alumno.confirmar_password) { 
      alert("Las contraseñas no coinciden");
      return false;
    }
    
    // Se consume el servicio para el registro de alumnos
    this.alumnosService.registrarAlumno(this.alumno).subscribe({
      next: (response: any) => { 
        alert("Alumno registrado exitosamente");
        console.log("Alumno registrado",response);
        //  Si se logró validar se va a lista de alumnos
        if (this.token != "") {
          this.router.navigate(["alumno"]);
        } else { 
          this.router.navigate(["/"]);
        }
        
      },
      error: (error: any) => { 
        if (error.status === 422) {
          this.errors = error.error.errors;
        } else { 
          alert("Error al registrar el alumno");
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
