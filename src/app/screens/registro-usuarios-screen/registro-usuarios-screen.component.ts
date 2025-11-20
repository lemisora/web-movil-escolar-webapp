import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MatRadioChange } from '@angular/material/radio';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-usuarios-screen',
  templateUrl: './registro-usuarios-screen.component.html',
  styleUrls: ['./registro-usuarios-screen.component.scss']
})
export class RegistroUsuariosScreenComponent implements OnInit {

  public tipo:string = "registro-usuarios";
  public editar:boolean = false;
  public rol:string = "";
  public idUser:number = 0;

  //Banderas para el tipo de usuario
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isMaestro:boolean = false;

  public tipo_user:string = "";

  //JSON para el usuario
  public user : any = {};

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private alumnosService: AlumnosService,
    private maestrosService: MaestrosService,
  ) { }

  ngOnInit(): void {
    // Verificar en que modo está, si editando o registrando un nuevo usuario
    if (this.activatedRoute.snapshot.params['rol'] != undefined) { 
      this.rol = this.activatedRoute.snapshot.params['rol'];
      console.log("Rol", this.rol);
    }
    
    // Verificar si viene un rol como parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      // Asignar a la variable global el valor de ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID", this.idUser);
      // Al iniciar la vista obtiene el usuario con sus datos mediante el ID
      this.obtenerUserPorID();
    }
  }

  // Función para obtener usuario por su ID
  public obtenerUserPorID() { 
    console.log("Obteniendo usuario por ID: rol -> ", this.rol, " con ID -> ", this.idUser);
    
    // Realizar peticiones de acuerdo al rol
    switch (this.rol) { 
      case "administrador": 
        console.log("Obteniendo los datos de un administrador..."); 
        this.administradoresService.obtenerAdminPorID(this.idUser).subscribe(
          (response) => { 
            this.user = response;
            console.log("Usuario obtenido: ", this.user);
            // Asignar datos
            this.user.first_name = response.user?.first_name || response.first_name;
            this.user.last_name = response.user?.last_name || response.last_name;
            this.user.email = response.user?.email || response.email;
            this.user.tipo_usuario = this.rol;
            this.isAdmin = true;
          },(error) => { 
            console.log("Error al obtener usuario por ID: ", error);
            alert("No se pudo obtener la información del administrador seleccionado");
          }
        );
        break;
      case "maestros": 
        console.log("Obteniendo los datos de un maestro..."); 
        this.maestrosService.obtenerMaestroPorID(this.idUser).subscribe(
          (response) => { 
            this.user = response;
            console.log("Maestro obtenido: ", this.user);
            // Asignar datos
            this.user.first_name = response.user?.first_name || response.first_name;
            this.user.last_name = response.user?.last_name || response.last_name;
            this.user.email = response.user?.email || response.email;
            this.user.tipo_usuario = this.rol;
            this.isMaestro = true;
          },(error) => { 
            console.log("Error al obtener usuario por ID: ", error);
            alert("No se pudo obtener la información del maestro seleccionado");
          }
        );
        break;
      case "alumnos": 
        console.log("Obteniendo los datos de un alumno..."); 
        this.alumnosService.obtenerAlumnoPorID(this.idUser).subscribe(
          (response) => { 
            this.user = response;
            console.log("Usuario obtenido: ", this.user);
            // Asignar datos
            this.user.first_name = response.user?.first_name || response.first_name;
            this.user.last_name = response.user?.last_name || response.last_name;
            this.user.email = response.user?.email || response.email;
            this.user.tipo_usuario = this.rol;
            this.isAlumno = true;
          },(error) => { 
            console.log("Error al obtener usuario por ID: ", error);
            alert("No se pudo obtener la información del alumno seleccionado");
          }
        );
        break;
      default: 
        "Error, rol desconocido"; break;
    }
  }
  
  // Función para conocer que usuario se ha elegido
  public radioChange(event: MatRadioChange) {
    if(event.value == "administrador"){
      this.isAdmin = true;
      this.isAlumno = false;
      this.isMaestro = false;
      this.tipo_user = "administrador";
    }else if (event.value == "alumno"){
      this.isAdmin = false;
      this.isAlumno = true;
      this.isMaestro = false;
      this.tipo_user = "alumno";
    }else if (event.value == "maestro"){
      this.isAdmin = false;
      this.isAlumno = false;
      this.isMaestro = true;
      this.tipo_user = "maestro";
    }
  }
  //Función para regresar a la pantalla anterior
  public goBack() {
    this.location.back();
  }


}
