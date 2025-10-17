import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};


@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService,
  ) { }
  
  public esquemaAlumno() {
    return {
      rol: "",
      clave_alumno: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmar_password: "",
      birthdate: null as Date | null,
      curp: "",
      rfc: "",
      edad: "",
      telefono: "",
      ocupacion: "",
    };
  }
  
  //Validación para el formulario
  public validarAlumno(data: any, editar: boolean) {
    console.log("Validando alumno... ", data);

    let error: any = {};

    //Validaciones

    if (!this.validatorService.required(data["clave_alumno"])) {
      error["clave_alumno"] = this.errorService.required;
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
    
    // Fecha de nacimiento y edad
    if (!this.validatorService.required(data['birthdate'])) {
      error['birthdate'] = this.errorService.required;
    } else {
      const edad = this.calcularEdad(new Date(data['birthdate']));
      if (edad < 18) {
        error['birthdate'] = 'El alumno debe ser mayor de 18 años';
      }
    }
    
    // Validación del CURP
    if (!this.validatorService.required(data["curp"])) {
      error["curp"] = this.errorService.required;
    } else if (!this.validatorService.min(data["curp"], 18)) {
      error["curp"] = this.errorService.min(18);

      alert("La longitud de caracteres del CURP es menor, deben ser 18");
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

    if (!this.validatorService.required(data["edad"])) {
      error["edad"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["edad"])) {
      alert("El formato es solo números");
    } else if (data["edad"] < 18) {
      error["edad"] = "La edad debe ser mayor o igual a 18 años";
    }

    if (!this.validatorService.required(data["telefono"])) {
      error["telefono"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["ocupacion"])) {
      error["ocupacion"] = this.errorService.required;
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
  public registrarAlumno(data: any) : Observable<any> { 
    return this.http.post<any>(`${environment.url_api}/register/`, data, httpOptions);
  }
}
