import { Component, OnInit } from '@angular/core';
import { ContactMessageResponse } from '../contact-message.model';
import { ContactService } from '../contact.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DialogModule } from 'primeng/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-contact-messages-admin-overview',
  standalone: true,
  imports: [CommonModule, TableModule,DialogModule,RouterModule],

  templateUrl: './contact-messages-admin-overview.component.html',
  styleUrl: './contact-messages-admin-overview.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0 }))
      ])
    ])
  ]
  
})
export class ContactMessagesAdminOverviewComponent implements OnInit{
  contactMessages: ContactMessageResponse[] = [];
  selectedMessage: ContactMessageResponse | null = null; // Za odabranu poruku
  messageDialogVisible: boolean = false; // Kontrola vidljivosti dijaloga

  constructor(
    private contactService: ContactService,
   
  ) {}

  ngOnInit(): void {
    this.getAllMessages();
  }

  getAllMessages(): void {
    this.contactService.getAllMessages().subscribe({
      next: (messages) => {
        this.contactMessages = messages;
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja poruka', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška!',
          text: 'Došlo je do greške pri učitavanju poruka.',
        });
      },
    });
  }

 
  openMessage(message: ContactMessageResponse): void {
    this.selectedMessage = message;
    this.messageDialogVisible = true;

    if (this.selectedMessage && !this.selectedMessage.read) {
      this.selectedMessage.read = true;
      this.updateMessageStatus(this.selectedMessage);
    }
  }

  updateMessageStatus(message: ContactMessageResponse): void {
    this.contactService.updateMessageStatus(message.id,true).subscribe({
      next: () => {
        console.log('Poruka označena kao pročitana.');
      },
      error: (err) => {
        console.error('Greška prilikom ažuriranja statusa poruke', err);
      }
    });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: 'Jeste li sigurni?',
      text: 'Ova akcija će trajno obrisati poruku!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da, obriši!',
      cancelButtonText: 'Poništi',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteMessage(id).subscribe({
          next: () => {
            this.contactMessages = this.contactMessages.filter(
              (msg) => msg.id !== id
            );
            Swal.fire({
              icon: 'success',
              title: 'Obrisano!',
              text: 'Poruka je obrisana.',
            });
          },
          error: () =>
            Swal.fire({
              icon: 'error',
              title: 'Greška!',
              text: 'Greška prilikom brisanja poruke',
            }),
        });
      }
    });
  }
}