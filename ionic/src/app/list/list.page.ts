import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '../services/notify.service';
import { UserService } from '../services/user.service';
import { List } from '../interfaces/List';
import { IonicModule, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { TournamentService } from '../services/tournament.service';
import { Division } from '../interfaces/Division';
import { FilterPipe } from '../filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Team } from '../interfaces/Team';
import { AlertController } from '@ionic/angular';
import { Campeonato } from '../interfaces/Campeonato';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true, // Marca el componente como standalone si es necesario
  imports: [CommonModule, FormsModule, IonicModule, FilterPipe, ReactiveFormsModule] // Importa los módulos y pipes necesarios
})

export class ListPage implements OnInit {

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(ev : any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor(private route: ActivatedRoute, private router: Router, private notifyService: NotifyService, private userService:UserService, private tournamentServ: TournamentService, private alertController: AlertController) { }
  @ViewChild(IonModal) modal!: IonModal;
  id:any
  campeonatos: Campeonato[] = []
  list: List = {
    ownerUser: { firstName: "",
      lastName: "",
    },
    ownerTeam: {
      _id: ""
    },
    teamPicture: "",
    shirtColor: "",
    alternativeShirtColor: "",
    nameList: "",
  }
  name:string = ""
  idOwnerTeam:any
  divisionId:any
  team: Team = {
    _id: "",
    teamName: "",
    teamNotes: "",
    socialMedia: "",
  }


  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
    this.getLista(this.id)
    this.getCampeonatos()
  }


  goPlayers(id:any){
    this.router.navigate([`/players/${id}`])
  }

  getCampeonatos(){
    this.tournamentServ.getCampeonatos().subscribe({
      next: (res : any) => {
        this.campeonatos = res.campeonatos
      },
      error: (err) => {
        console.log(err.error.message);
      }
    })
  }

  confirm(id:any, form:any){
    const formulario = {
      shirtColor: form.shirtColor.value,
      alternativeShirtColor: form.alternativeShirtColor.value,
      isTeamListActive: form.isTeamListActive.value === 'true',
    }
    console.log(formulario)
    this.userService.editList(id,formulario).subscribe({
      next: (res : any) => {
        this.notifyService.success(res.message)
        this.getLista(this.id)
        this.setOpen(false)
      },
      error: (err) => {
        console.log(err.error.message);
      }
    })
  }


  volver(id:any){
    this.router.navigate([`/create-list/${id}`])
  }

  getLista(id:any) {
    this.userService.getList(id).subscribe({
      next: (res : any) => {
        this.list = res.list;
        this.name = `${this.list.ownerUser?.firstName} ${this.list.ownerUser?.lastName}`;
        this.idOwnerTeam = `${this.list.ownerTeam?._id}`
        console.log(this.divisionId)
      },
      error: (err: any) => {
        console.log(err.error.message)
      }
    })
  }

  async deleteList(id: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres borrar esta lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // El usuario ha cancelado, no hacer nada
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            // El usuario ha confirmado, proceder con la eliminación
            this.userService.eliminarLista(id).subscribe({
              next: (res: any) => {
                this.notifyService.success(res.message);
                setTimeout(() => {
                  window.location.href = `/create-list/${this.list.ownerTeam?._id}`;
                }, 500); 
              },
              error: (err: any) => {
                this.notifyService.error(err.error.message);
              }
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

}
