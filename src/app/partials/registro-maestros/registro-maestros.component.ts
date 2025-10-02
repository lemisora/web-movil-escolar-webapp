import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-registro-maestros",
  templateUrl: "./registro-maestros.component.html",
  styleUrls: ["./registro-maestros.component.scss"],
  standalone: false,
})
export class RegistroMaestrosComponent implements OnInit {
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  constructor() {}

  ngOnInit(): void {}
}
