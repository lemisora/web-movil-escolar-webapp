import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class MaestrosService {
  
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService,
  ) { }
  
  public esquemaMaestro() {
    return {
      rol: "",
      clave_maestro: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmar_password: "",
      birthdate: "",
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

    //Return arreglo

    return error;
  }
}
