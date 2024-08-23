import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../interfaces/Category';
import { Format } from '../interfaces/Format';
import { Division } from '../interfaces/Division';
import { Season } from '../interfaces/Season';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  //API_URL = 'https://tdeabackend-production.up.railway.app/api/futbol'
  API_URL= 'http://localhost:3000/api/futbol'

  constructor(private http : HttpClient) { }

  /***************************************CATEGORIAS******************************************/ 

  createCategory(form : Category){
    return this.http.post(`${this.API_URL}/agregar-categoria`, form)
  }

  getCategory(id : any) {
    return this.http.get(`${this.API_URL}/obtener-categoria/${id}`)
  }

  getCategories(){
    return this.http.get(`${this.API_URL}/obtener-categorias`)
  }

  editCateogry(id:any, form : Category){
    return this.http.put(`${this.API_URL}/editar-categoria/${id}`, form)
  }

  deleteCategory(id:any){
    return this.http.delete(`${this.API_URL}/eliminar-categoria/${id}`)
    
  }

  /*************************************FORMATOS***********************************************/

  createFormat(form : Format){
    return this.http.post(`${this.API_URL}/agregar-formato`, form)
  }

  getFormats(){
    return this.http.get(`${this.API_URL}/obtener-formatos`)
  }

  getFormat(id: any){
    return this.http.get(`${this.API_URL}/obtener-formato/${id}`)
  }

  editFormat(id : any, formato : any){
    return this.http.put(`${this.API_URL}/editar-formato/${id}`, formato)
  }

  deleteFormat(id:any){
    return this.http.delete(`${this.API_URL}/eliminar-formato/${id}`)
  }

/*********************************************DIVISIONES***********************************************/ 

  createDivision(form : any){
    return this.http.post(`${this.API_URL}/agregar-division`, form)
  }

  getDivisions(){
    return this.http.get(`${this.API_URL}/obtener-divisiones`)
  }

  getDivision(id:any){
    return this.http.get(`${this.API_URL}/obtener-division/${id}`)
  }

  editDivision(id:any, form : any){
    return this.http.put(`${this.API_URL}/editar-division/${id}`, form)
  }

  deleteDivision(id:any){
    return this.http.delete(`${this.API_URL}/eliminar-division/${id}`)
  }

/*******************************************TEMPORADAS****************************************************/

  createSeason(form:Season){
    return this.http.post(`${this.API_URL}/agregar-season`, form)
  }

  getSeasons(){
    return this.http.get(`${this.API_URL}/obtener-seasons`)
  }

  getSeason(id:any){
    return this.http.get(`${this.API_URL}/obtener-season/${id}`)
  }

  editSeason(id:any, form:any){
    return this.http.put(`${this.API_URL}/editar-season/${id}`, form)
  }

  deleteSeason(id:any){
    return this.http.delete(`${this.API_URL}/eliminar-season/${id}`)
  }

  /*******************************************TOURNAMENTS***************************************************/ 

  createTournament(form:any){
    return this.http.post(`${this.API_URL}/crear-torneo`, form)
  }

  getTournament(id:any){
    return this.http.get(`${this.API_URL}/obtener-torneo/${id}`)
  }

  getTournaments(){
    return this.http.get(`${this.API_URL}/obtener-torneos`)
  }

  editTournaments(id:any, form:any){
    return this.http.put(`${this.API_URL}/editar-torneo/${id}`, form)
  }

  deleteTournaments(id:any){
    return this.http.delete(`${this.API_URL}/eliminar-torneo/${id}`)
  }

  /****************************************************DAYS*****************************************************/ 

  createDay(id:any, form:any){
    return this.http.post(`${this.API_URL}/agregar-dia/${id}`, form)
  }

  getDay(id:any){ 
    return this.http.get(`${this.API_URL}/obtener-dia/${id}`)
  }

  getDays(id:any){
    return this.http.get(`${this.API_URL}/obtener-dias/${id}`)
  }

  editDays(id:any, form:any){
    return this.http.put(`${this.API_URL}/editar-dia/${id}`, form)
  }

  deleteDay(id:any){
    return this.http.delete(`${this.API_URL}/eliminar-dia/${id}`)
  }

  /*******************************************************HORARIOS*************************************************/

  createSchedule(id:any, form:any){
    return this.http.post(`${this.API_URL}/crear-horario/${id}`, form)
  }

  getSchedule(id:any){
    return this.http.get(`${this.API_URL}/obtener-horario/${id}`)
  }

  getSchedules(id:any){
    return this.http.get(`${this.API_URL}/obtener-horarios/${id}`)
  }

  editSchedules(id:any, form:any){
    return this.http.put(`${this.API_URL}/editar-horario/${id}`, form)
  }

  deleteSchedule(id:any){
    return this.http.delete(`${this.API_URL}/eliminar-horario/${id}`)
  }
}
