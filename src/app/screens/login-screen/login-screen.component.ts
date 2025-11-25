import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {

  public username:string = "";
  public password:string = "";
  public type: string = "password";
  public errors:any = {};
  public load:boolean = false;

  constructor(
    public router: Router,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    // Initialization logic here
  }

  public login(){
    // Valida que los datos ingresados sean correctos
    this.errors = {};
    this.errors = this.facadeService.validarLogin(this.username, this.password);
    if(Object.keys(this.errors).length > 0){
      return false;
    }

    console.log("Pasó la validación");

    this.load = true;
    
    // Lógica para el inicio de sesión (login)
    this.facadeService.login(this.username, this.password).subscribe(
      (response : any) => { 
        this.facadeService.saveUserData(response);
        const role = response.rol;
        switch (role) { 
          case "administrador":
            this.router.navigate(["/administrador"]);break;
          case "alumno":
            this.router.navigate(["/alumnos"]);
            break;
          case "maestro":
            this.router.navigate(["/maestros"]);break;
          default:
            this.router.navigate(["home"]); 
            break;
        }
        this.load = false;
      },
      (error: any) => { 
        this.load = false;
        alert("Error al iniciar sesión " + error.message);
        this.errors.general = "Credenciales inválidas, por favor inténtalo nuevamente";
      },
    );
  }

  public showPassword(){
    this.type = this.type === "password" ? "text" : "password";
  }

  public registrar(){
    this.router.navigate(["registro-usuarios"]);
  }
}
