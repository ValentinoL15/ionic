import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { SharedService } from '../services/shared.service';
import { IonModal } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor( private router:Router, private sharedService: SharedService) { }
  @ViewChild(IonModal) modal!: IonModal ;

  
  isTeam: boolean = false;
  newTeam: any[] = [];

  

  ngOnInit() {
  
  }

  ir() {
    this.router.navigate(['/create-team']);
    this.sharedService.setIsTeam(this.isTeam = true)
  }

  editar() {
    this.modal.dismiss(null, 'cancel');
  }

  deleteTeam(){
    const confirmed = confirm('¿Estás seguro de que deseas borrar el equipo?');
    if (confirmed) {
      this.sharedService.setNewTeam([]);
      this.sharedService.setIsTeam(false);
    }
  }
  

}
