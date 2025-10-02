import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-registro-alumnos",
  templateUrl: "./registro-alumnos.component.html",
  styleUrls: ["./registro-alumnos.component.scss"],
  standalone: false,
})
export class RegistroAlumnosComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};
  constructor() {}
  ngOnInit(): void {}
}
