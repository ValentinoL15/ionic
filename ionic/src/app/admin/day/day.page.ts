import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Day } from 'src/app/interfaces/Day';
import { NotifyService } from 'src/app/services/notify.service';
import { TournamentService } from 'src/app/services/tournament.service';
import { Schedule } from 'src/app/interfaces/Schedule';
import { AlertController } from '@ionic/angular';
import { Stadium } from 'src/app/interfaces/Stadium';
import { Sede } from 'src/app/interfaces/Sede';
import { Tournament } from 'src/app/interfaces/Tournament';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
})
export class DayPage implements OnInit {

  id:any;
  dayId:any;

  tournament: Tournament = {
    _id: "",
    nameFantasy: "",
    ano: 0,
    campeonato:{
      type: ""
    } ,
    edad: {
      type: ""
    },
    rangeAgeSince: 0,
    rangeAgeUntil: 0,
    ageDescripcion: "",
    category: {
      _id: "",
      categoryName : ""
    },
    format: {
      _id:"",
    formatName: "",
    minPlayers: 0,
    maxPlayers: 0
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
    tournamentDate: new Date(),
    tournamentNotes: "",
    isTournamentMasculine: false,
    isTournamentActive: false,
    tarifaInscripcion: 0,
    tarifaPartido: 0,
    cupos: 0
  }

  tournamentDay: any = null;
  selectedStadium: string | null = null; 

  horarios: Schedule[] = []
  newTime: string = '';  // Variable para almacenar el horario nuevo
  selectedTimes: string[] = []; 
  stadiums: Stadium[] = [];
  sedes: Sede[] = [];
  times = [
    "00:00", "00:15", "00:30", "00:45", 
    "01:00", "01:15", "01:30", "01:45", 
    "02:00", "02:15", "02:30", "02:45", 
    "03:00", "03:15", "03:30", "03:45", 
    "04:00", "04:15", "04:30", "04:45", 
    "05:00", "05:15", "05:30", "05:45", 
    "06:00", "06:15", "06:30", "06:45", 
    "07:00", "07:15", "07:30", "07:45", 
    "08:00", "08:15", "08:30", "08:45", 
    "09:00", "09:15", "09:30", "09:45", 
    "10:00", "10:15", "10:30", "10:45", 
    "11:00", "11:15", "11:30", "11:45", 
    "12:00", "12:15", "12:30", "12:45", 
    "13:00", "13:15", "13:30", "13:45", 
    "14:00", "14:15", "14:30", "14:45", 
    "15:00", "15:15", "15:30", "15:45", 
    "16:00", "16:15", "16:30", "16:45", 
    "17:00", "17:15", "17:30", "17:45", 
    "18:00", "18:15", "18:30", "18:45", 
    "19:00", "19:15", "19:30", "19:45", 
    "20:00", "20:15", "20:30", "20:45", 
    "21:00", "21:15", "21:30", "21:45", 
    "22:00", "22:15", "22:30", "22:45", 
    "23:00", "23:15", "23:30", "23:45"
  ];


  addTime() {
    if (this.newTime) {
      this.times.push(this.newTime);  // Agrega el nuevo horario al array
      this.newTime = '';  // Resetea el campo para nuevos ingresos
      console.log(this.times)
    }
  }

  removeTime(index: number) {
    this.times.splice(index, 1);  // Elimina el horario seleccionado
  }
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

  dayForm: FormGroup
  isButtonDisabled: boolean = true;

  constructor(private tournamentServ: TournamentService, private notifyService: NotifyService, private router: Router, private route: ActivatedRoute, private alertController: AlertController, private fb: FormBuilder ) {
    this.dayForm = this.fb.group({
      day: [''],
      stadium: [''],
      time: ['']
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']
      this.dayId = params['dayId']
    })
    this.getDayTournament()
    this.getStadiums()
    // Suscribirse a los cambios en el formulario
    this.dayForm.valueChanges.subscribe(() => {
      this.isButtonDisabled = !(
        this.dayForm.get('day')?.dirty ||
        this.dayForm.get('stadium')?.dirty ||
        this.dayForm.get('time')?.dirty
      );
    });
  }

  goSchedule(id : any){
    this.router.navigate([`/admin/edit-horarios/${id}`])
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  volver(){
    this.router.navigate([`/admin/create-day/${this.id}`])
    this.dayForm.reset()
  }

  getTournament(){
    this.tournamentServ.getTournament(this.tournament.daysTournament).subscribe({
      next: (res : any) => {
        this.tournament = res.tournamentFound;
        console.log(this.tournament)
      },
      error: (err: any) => {
        this.notifyService.error(err.error.message)
      }
    })
  }
  getDayTournament() {
    this.tournamentServ.getDayTournament(this.id, this.dayId).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res); // Verificar la respuesta
        if (res.day) {
          this.tournamentDay = res.day;
          console.log('Día del torneo:', this.tournamentDay); // Verificar que el día esté asignado
          
          // Asignar los horarios seleccionados desde el backend a selectedTimes
          this.selectedTimes = this.tournamentDay.time; 
          
          // Si el estadio está disponible, puedes acceder a él aquí
          if (this.tournamentDay.stadium) {
            console.log('Estadio:', this.tournamentDay.stadium.code); // Verificar que el estadio esté asignado
          }
        } else {
          this.notifyService.error('No hay día disponible.');
        }
      },
      error: (err: any) => {
        this.notifyService.error(err.error.message);
      }
    });
  }

  editDayTournament(){
    const formulario = {
      day: this.dayForm.value.day,
      stadium: this.dayForm.value.stadium,
      time: this.dayForm.value.time
    }
    this.tournamentServ.editDayTournament(this.id, this.dayId, formulario).subscribe({
      next: (res: any) => {
        this.notifyService.success(res.message);
        setTimeout(() => {
          window.location.href = `admin/create-day/${this.id}`
        }, 500)
      },
      error: (err: any) => {
        this.notifyService.error(err.error.message);
      }
    })
  }

  getStadiums(){
    this.tournamentServ.getEstadios().subscribe({
      next: (res : any) => {
        this.stadiums = res.stadiums;
      },
      error: (err: any) => {
        this.notifyService.error(err.error.message)
      }
    })
  }

  async deleteDayTournament() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres borrar este Dia?',
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
            this.tournamentServ.deleteDayTournament(this.id, this.dayId).subscribe({
              next: (res: any) => {
                this.notifyService.success(res.message);
                setTimeout(() => {
                  window.location.href = `/admin/create-day/${this.id}`;
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
