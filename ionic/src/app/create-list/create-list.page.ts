import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { List } from '../interfaces/List';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TournamentService } from '../services/tournament.service';
import { Division } from '../interfaces/Division';



@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.page.html',
  styleUrls: ['./create-list.page.scss'],
})
export class CreateListPage implements OnInit {
  
  id:any;
  lists: List[] = []
  list: List = {
    shirtColor: "",
    alternativeShirtColor: "",
    isTeamListActive: false,
    nameList: ""
  }
  form: FormGroup
  divisiones: Division[] = []
  selectedFile: File | null = null;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private notifyService: NotifyService, private formBuilder: FormBuilder, private tournamentServ: TournamentService) { 
    this.form = this.formBuilder.group({
      nameList: ['', Validators.required],
      shirtColor: ['', Validators.required],
      alternativeShirtColor: ['', Validators.required],
      isTeamListActive: ['', Validators.required],
    })
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  volver(){
    this.router.navigate([`/team/${this.id}`]);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
    this.getLists(this.id)
    this.getDivisions()
  }
  
  goList(id:any){
    this.router.navigate([`/list/${id}`])
  }
  getLists(id:any){
    this.userService.getLists(id).subscribe({
      next: (res : any) => {
        this.lists = res.lista
      },
      error: (err) => {
        console.log(err.error.message);
      }
    })
  }

  getDivisions(){
    this.tournamentServ.getDivisions().subscribe({
      next: (res : any) => {
        this.divisiones = res.divisions
      },
      error: (err) => {
        console.log(err.error.message);
      }
    })
  }

  createList(){
    const formulario = {
      nameList: this.form.value.nameList,
      shirtColor: this.form.value.shirtColor,
      alternativeShirtColor: this.form.value.alternativeShirtColor,
      isTeamListActive: this.form.value.isTeamListActive === false,
    };
    console.log(formulario)
    this.userService.createList(this.id,formulario).subscribe({
      next: (res : any) => {
        this.notifyService.success(res.message)
        window.location.href = `/create-list/${this.id}`
      },
      error: (err: any) => {
        this.notifyService.error(err.error.message)
      }
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    console.log('Archivo seleccionado:', file);
  }


}
