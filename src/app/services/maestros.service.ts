import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FacadeService } from "./facade.service";
import { ErrorsService } from "./tools/errors.service";
import { ValidatorService } from "./tools/validator.service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class MaestrosService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService,
  ) {}

  public esquemaMaestro() {
    return {
      rol: "",
      clave_maestro: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmar_password: "",
      birthdate: null as Date | null,
      telefono: "",
      rfc: "",
      cubiculo: "",
      area_inv: "",
      materias: [],
    };
  }

  //Validación para el formulario
  public validarMaestro(data: any, editar: boolean) {
    console.log("Validando maestro... ", data);

    let error: any = {};

    //Validaciones

    if (!this.validatorService.required(data["clave_maestro"])) {
      error["clave_maestro"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["first_name"])) {
      error["first_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["last_name"])) {
      error["last_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["email"])) {
      error["email"] = this.errorService.required;
    } else if (!this.validatorService.max(data["email"], 40)) {
      error["email"] = this.errorService.max(40);
    } else if (!this.validatorService.email(data["email"])) {
      error["email"] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data["password"])) {
        error["password"] = this.errorService.required;
      }

      if (!this.validatorService.required(data["confirmar_password"])) {
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data["rfc"])) {
      error["rfc"] = this.errorService.required;
    } else if (!this.validatorService.min(data["rfc"], 12)) {
      error["rfc"] = this.errorService.min(12);

      alert("La longitud de caracteres del RFC es menor, deben ser 12");
    } else if (!this.validatorService.max(data["rfc"], 13)) {
      error["rfc"] = this.errorService.max(13);

      alert("La longitud de caracteres del RFC es mayor, deben ser 13");
    }

    if (!this.validatorService.required(data["telefono"])) {
      error["telefono"] = this.errorService.required;
    }

    // Fecha de nacimiento y edad
    if (!this.validatorService.required(data['birthdate'])) {
          error['birthdate'] = this.errorService.required;
    } else {
      const edad = this.calcularEdad(new Date(data['birthdate']));
      if (edad < 18) {
        error['birthdate'] = 'El maestro debe ser mayor de 18 años';
      }
    }
    // Área de investigación
    if (!this.validatorService.required(data["area_inv"])) {
      error["area_inv"] = this.errorService.required;
    }
    // Cubículo
    if (!this.validatorService.required(data["cubiculo"])) {
      error["cubiculo"] = this.errorService.required;
    }

    //Materias
    if (!this.validatorService.required(data["materias"])) {
      error["materias"] = this.errorService.required;
    } else if (data["materias"].length == 0) {
      error["materias"] = "Debes seleccionar al menos una materia";
    }
    //Return arreglo

    return error;
  }
  
  private calcularEdad(fecha: Date): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }
  
  // Servicios de peticiones HTTP
  // Registro de administrador en la base de datos
  public registrarMaestro(data: any) : Observable<any> { 
    return this.http.post<any>(`${environment.url_api}/profesor/`, data, httpOptions);
  }
}
