import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Format } from 'src/app/interfaces/Format';
import { NotifyService } from 'src/app/services/notify.service';
import { TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-create-format',
  templateUrl: './create-format.page.html',
  styleUrls: ['./create-format.page.scss'],
})
export class CreateFormatPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  form:FormGroup

  formatos: Format[] = []

  constructor(private formBuilder: FormBuilder, private tournamentServ: TournamentService, private notifyService: NotifyService, private router : Router) {
    this.form = this.formBuilder.group({
      formatName: ['', [Validators.required, Validators.minLength(3)]],
      minPlayers: ['', Validators.required],
      maxPlayers: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.getFormats()
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  volver(){
    this.router.navigate(['/admin/admin-home'])
  }

  createFormat(){
    const form : Format = {
      formatName: this.form.value.formatName,
      minPlayers: this.form.value.minPlayers,
      maxPlayers: this.form.value.maxPlayers
    }
    this.tournamentServ.createFormat(form).subscribe({
      next: (res : any) => {
        this.notifyService.success(res.message)
        this.formatos.push(res.format)
        this.cancel()
      },
      error: (err) => {
        console.log(err);
        this.notifyService.error(err.error.message)
      }
    })
  }

  getFormats(){
    this.tournamentServ.getFormats().subscribe({
      next: (res : any) => {
        this.formatos = res.formats || [];
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  goFormat(id:any){
    this.router.navigate([`/format/${id}`])
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}