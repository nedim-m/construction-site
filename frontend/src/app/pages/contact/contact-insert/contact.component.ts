import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../contact.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactMessageService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactMessageService.insertMessage(this.contactForm.value).subscribe(
        () => {
          Swal.fire('Uspeh!', 'Poruka je uspešno poslata.', 'success');
          this.contactForm.reset();  
        },
        () => {
          Swal.fire('Greška!', 'Došlo je do greške prilikom slanja poruke.', 'error');
        }
      );
    }
  }
}
