import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Campeonato } from 'src/app/interfaces/Campeonato';
import { Category } from 'src/app/interfaces/Category';
import { Edad } from 'src/app/interfaces/Edad';
import { Format } from 'src/app/interfaces/Format';
import { Tournament } from 'src/app/interfaces/Tournament';
import { NotifyService } from 'src/app/services/notify.service';
import { TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.page.html',
  styleUrls: ['./tournaments.page.scss'],
})
export class TournamentsPage implements OnInit {

  id:any
  categories: Category[] = [];
  formats: Format[] = []
  campeonatos: Campeonato[] = []
  edades: Edad[] = []
  tournament: Tournament = {
    nameFantasy: "",
    ano: 0,
    campeonato:{
      _id: "",
      type: ""
    },
    edad: {
      _id: "",
      type: ""
    },
     daysTournament: [{
      _id: "",
      day: {
        _id: "",
        type: ""
      },
      stadium: {
        _id: "",
        belongToSede: "",
        code: "",
        type: 0,
        length: 0,
        width: 0,
        roof: "",
        grass: "",
        punctuaction: 0,
      },
      time: {
        _id: "",
        type: []
      }
    }],
    rangeAgeSince: 0,
    rangeAgeUntil: 0,
    ageDescripcion: "",
    category: {
      _id: "",
      categoryName : "",
    },
    format: {
      _id:"",
    formatName: "",
    minPlayers: 0,
    maxPlayers: 0
    },
    tournamentDate: new Date(),
    tournamentNotes: "",
    isTournamentMasculine: false,
    isTournamentActive: false,
    tarifaInscripcion: 0,
    tarifaPartido: 0,
    cupos: 0,
  }
  currentYear = new Date().getFullYear();
  ageRange: { from: number; to: number } = { from: 0, to: 0 };

  constructor(private tournamentServ: TournamentService, private notifyService: NotifyService, private router: Router, private route: ActivatedRoute, private alertController: AlertController) { }

  ids: string = '';

  async presentAddCuposAlert() {
    const alert = await this.alertController.create({
      header: 'Agregar Cupos',
      inputs: [
        {
          name: 'cupos',
          type: 'number',
          placeholder: 'Insertar Cupos',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => this.handleAddCupos(data),
        },
      ],
    });
    await alert.present();
  }

  async presentRestCuposAlert() {
    const alert = await this.alertController.create({
      header: 'Restar Cupos',
      inputs: [
        {
          name: 'cupos',
          type: 'number',
          placeholder: 'Restar Cupos',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => this.handleRestCupos(data),
        },
      ],
    });
    await alert.present();
  }

  handleAddCupos(data: any) {
    const cupos = Number(data.cupos);
    if (!isNaN(cupos) && cupos > 0) {
      this.tournamentServ.editCupos(this.id, cupos).subscribe({
        next: (res: any) => {
          localStorage.setItem('cuposUpdated', res.message);
          window.location.href = `admin/tournaments/${this.id}`;
        },
        error: (err: any) => {
          this.notifyService.error(err.error.message);
        },
      });
    } else {
      this.notifyService.error('El valor de los cupos es inválido');
    }
  }

  handleRestCupos(data: any) {
    const cupos = Number(data.cupos);
    if (!isNaN(cupos) && cupos > 0) {
      this.tournamentServ.restarCupos(this.id, cupos).subscribe({
        next: (res: any) => {
          localStorage.setItem('cuposUpdated', res.message);
          window.location.href = `admin/tournaments/${this.id}`;
        },
        error: (err: any) => {
          this.notifyService.error(err.error.message);
        },
      });
    } else {
      this.notifyService.error('El valor de los cupos es inválido');
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']
      this.getTournament(this.id)
    })
    this.getCategories()
    this.getFormats()
    this.getCampeonatos()
    this.getEdades();
    const message = localStorage.getItem('cuposUpdated');
    if (message) {
      // Muestra el mensaje usando el servicio de notificaciones
      this.notifyService.success(message);
  
      // Limpia el mensaje del localStorage para evitar que se muestre nuevamente
      localStorage.removeItem('cuposUpdated');
    }
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  volver(){
    this.router.navigate(['/admin/home-tournament'])
  }

  goDay(){
    this.router.navigate([`/admin/create-day/${this.id}`])
  }

  goStadiums(){
    this.router.navigate([`/admin/stadiums-disponibles/${this.id}`])
  }
  
  goTeasmSubscribed(){
    this.router.navigate([`/admin/suscribed-teams/${this.id}`])
  }

  getCampeonatos(){
    this.tournamentServ.getCampeonatos().subscribe({
      next: (res : any) => {
        this.campeonatos = res.campeonatos
      },
      error: (err : any) => {
        this.notifyService.error(err.error.message)
      }
    })
  }

  getEdades(){
    this.tournamentServ.getEdades().subscribe({
      next: (res : any) => {
        this.edades = res.edades
      },
      error: (err : any) => {
        this.notifyService.error(err.error.message)
      }
    })
  }

  getCategories(){
    this.tournamentServ.getCategories().subscribe({
      next: (res : any) => {
        this.categories = res.categories
      },
      error: (err) => {
        this.notifyService.error(err.error.message)
      }
    })
  }
  
  getFormats(){
    this.tournamentServ.getFormats().subscribe({
      next: (res : any) => {
        this.formats = res.formats
      },
      error: (err) => {
        this.notifyService.error(err.error.message)
      }
    })
  }

  getTournament(id:any){
    this.tournamentServ.getTournament(id).subscribe({
      next: (res : any) => {
        this.tournament = res.tournamentFound
        this.ageRange = res.years; 
        this.tournament.tournamentDate = this.adjustDate(new Date(this.tournament.tournamentDate));
      },
      error: (err: any) => {
        this.notifyService.error(err.error.message)
      }
    })
  }

  adjustDate(date: Date): Date {
    // Ajuste para compensar el desfase de la zona horaria
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + offset * 60000);
    return adjustedDate;
  }

  editTournament(id:any, form:any){
    const formulario = {
      nameFantasy: form.nameFantasy.value, 
      rangeAgeSince: form.rangeAgeSince.value,
      rangeAgeUntil: form.rangeAgeUntil.value,
      tournamentDate: form.tournamentDate.value,
      campeonato: form.campeonato.value,
      edad: form.edad.value,
      ano:form.ano.value,
      category: form.category.value,
      format: form.format.value,
      isTournamentMasculine: form.isTournamentMasculine.value,
      isTournamentActive: form.isTournamentActive.value,
      tournamentNotes: form.tournamentNotes.value,
      tarifaInscripcion: form.tarifaInscripcion.value,
      tarifaPartido: form.tarifaPartido.value,
    };
    console.log(formulario)
    this.tournamentServ.editTournament(id, formulario).subscribe({
      next: (res: any) => {
        this.notifyService.success(res.message)
        this.getTournament(id)
        window.location.href = `/admin/tournaments/${this.id}`
      },
      error: (err: any) => {
        this.notifyService.error(err.error.message)
      }
    })
    
  }

  async deleteTorneo(id: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres borrar este Torneo?. Se borrarán todos sus datos',
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
            this.tournamentServ.deleteTournament(id).subscribe({
              next: (res: any) => {
                this.notifyService.success(res.message);
                setTimeout(() => {
                  window.location.href = `/admin/home-tournament`;
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

  



}
