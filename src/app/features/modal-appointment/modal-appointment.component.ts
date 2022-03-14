import { HomeService } from '../../core/services/home.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalAppointmentService } from '../../core/services/modal-appointment.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Data,
  Horario,
  Medico,
  AgendasDisponiveis,
  // Especialidade,
} from '../../core/interfaces/consultas_d';
import { Especialidade } from 'src/app/core/models/especialidade.model';

@Component({
  selector: 'app-modal-appointment',
  templateUrl: './modal-appointment.component.html',
  styleUrls: ['./modal-appointment.component.sass'],
})
export class ModalAppointmentComponent implements OnInit {
  criarConsultaForm!: FormGroup;

  especialidades!: Especialidade[];
  medicos!: Medico[];
  horarios!: any[];
  agendasDisponiveis!: any[];

  agendaConsulta: any;

  idEspecialidade!: Number;
  idMedico!: Number;
  idAgenda!: any;

  diaConsulta!: any;
  horaConsulta!: any;

  respostaConsulta!: any[];

  showErrorMedico: boolean = false;
  showErrorDia: boolean = false;
  showErrorHora: boolean = false;

  requiredPostCreateConsulta: any = {
    agenda_id: 0,
    horario: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalAppointmentService,
    private dialogRef: MatDialogRef<ModalAppointmentComponent>,
    private homeService: HomeService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.criarConsultaForm = this.formBuilder.group({
      especialidade: [null, Validators.required],
      medico: [null, Validators.required],
      agenda: [null, Validators.required],
      hora: [null, Validators.required],
    });

    this.getEspecialidades();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
    });
  }

  getEspecialidades() {
    this.modalService.getEspecialidades().subscribe((data) => {
      this.especialidades = data;
      console.log(data);
    });
  }

  getMedicos() {
    this.showErrorMedico = false;
    this.showErrorDia = false;

    this.idEspecialidade = this.criarConsultaForm.value.especialidade;
    console.log(this.idEspecialidade);
    if (this.idEspecialidade != null) {
      this.modalService.getMedicos(this.idEspecialidade).subscribe((data) => {
        this.medicos = data;
        console.log(data);
      });
      this.idMedico = this.criarConsultaForm.value.medico;
    } else {
      this.showErrorMedico = true;
      // this.openSnackBar('Selecione primeiro a especialidade!', 'Fechar');
    }
  }

  getAgendasDisponiveis() {
    this.showErrorHora = false;

    if (this.idMedico != null && this.idEspecialidade != null) {
      this.modalService
        .getAgendasDisponiveis(this.idMedico, this.idEspecialidade)
        .subscribe((data) => {
          this.agendasDisponiveis = data.results;
        });
      this.diaConsulta = this.criarConsultaForm.value.agenda;
    } else {
      this.showErrorDia = true;
      // this.openSnackBar('Selecione primeiro o medico!', 'Fechar');
    }
  }

  getHora() {
    if (
      this.idMedico != null &&
      this.idEspecialidade != null &&
      this.diaConsulta != null
    ) {
      this.modalService
        .getAgenda(this.idMedico, this.idEspecialidade, this.diaConsulta)
        .subscribe((data) => {
          this.respostaConsulta = data.results[0];
          this.agendaConsulta = JSON.stringify(this.respostaConsulta);
          this.agendaConsulta = JSON.parse(this.agendaConsulta);
          this.horarios = this.agendaConsulta.horarios;
          this.requiredPostCreateConsulta.agenda_id = this.agendaConsulta.id;
        });
      this.requiredPostCreateConsulta.horario =
        this.criarConsultaForm.value.hora;
    } else {
      this.showErrorHora = true;
      // this.openSnackBar('Selecione primeiro a data!', 'Fechar');
    }
  }

  submitForm() {
    this.modalService
      .postCriarConsulta(this.requiredPostCreateConsulta)
      .subscribe({
        next: () => {
          this.openSnackBar('Consulta Marcada!', 'Fechar');
          this.dialogRef.close();
          this.criarConsultaForm.reset();
        },
        error: () => {
          this.openSnackBar('Erro!', 'Fechar');
        },
        complete: () => {
          window.location.reload();
        },
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
