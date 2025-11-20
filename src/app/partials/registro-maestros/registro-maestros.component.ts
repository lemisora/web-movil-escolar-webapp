import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MaestrosService } from "src/app/services/maestros.service";
import { FacadeService } from "src/app/services/facade.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-registro-maestros",
  templateUrl: "./registro-maestros.component.html",
  styleUrls: ["./registro-maestros.component.scss"],
  standalone: false,
})
export class RegistroMaestrosComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";
  public idUser: number = 0;

  // Para las contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = "password";
  public inputType_2: string = "password";

  public areas_investigacion: string[] = [
    "Inteligencia Artificial",
    "Algoritmos",
    "Tecnologías Web",
    "Bases de datos",
  ];

  public materias_seleccionadas: any = {};

  // Auxiliares
  public materias: string[] = [
    "Aplicaciones web",
    "Programación I",
    "Bases de datos",
    "Tecnologías web",
    "Minería de datos",
    "Desarrollo móvil",
    "Estructuras de datos",
    "Administración de redes",
    "Ingeniería de Software",
    "Administración de S.O.",
  ];

  constructor(
    private location: Location,
    private maestrosService: MaestrosService,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.materias.forEach((materia) => {
      this.materias_seleccionadas[materia] = false;
    });
    // Validar si cuenta con un token de inicio de sesión
    if (this.activatedRoute.snapshot.params["id"] != undefined) {
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params["id"];
      console.log("ID del usuario", this.idUser);
      this.maestro = this.datos_user;
      // Marcar las materias seleccionadas
      if (this.maestro.materias && this.maestro.materias.length > 0) {
        this.maestro.materias.forEach((materia_maestro: string) => {
          if (this.materias_seleccionadas.hasOwnProperty(materia_maestro)) {
            this.materias_seleccionadas[materia_maestro] = true;
          }
        });
      }
    } else {
      this.maestro = this.maestrosService.esquemaMaestro();
      this.maestro.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    // Imprimir datos en consola
    console.log("Datos del usuario", this.maestro);
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

    this.maestro.birthdate = event.value.toISOString().split("T")[0];
    console.log("Fecha de nacimiento: ", this.maestro.birthdate);
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    this.maestro.materias = Object.keys(this.materias_seleccionadas).filter(
      (materia) => this.materias_seleccionadas[materia],
    );
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(
      this.maestro,
      this.editar,
    );
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Validar que las contraseñas ingresadas coincidan
    if (this.maestro.password !== this.maestro.confirmar_password) {
      alert("Las contraseñas no coinciden");
      return false;
    }

    // Se consume el servicio para el registro de maestros
    this.maestrosService.registrarMaestro(this.maestro).subscribe({
      next: (response: any) => {
        alert("Maestro registrado exitosamente");
        console.log("Maestro registrado", response);
        //  Si se logró validar se va a lista de maestros
        if (this.token != "") {
          this.router.navigate(["maestro"]);
        } else {
          this.router.navigate(["/"]);
        }
      },
      error: (error: any) => {
        if (error.status === 422) {
          this.errors = error.error.errors;
        } else {
          alert("Error al registrar el maestro");
        }
      },
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
