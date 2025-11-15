import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],   //  required for formGroup + *ngIf
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup; // ✅ Declare form here

  constructor(private fb: FormBuilder, private authService: AuthService) {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      role: ['Driver', Validators.required],

      // Driver fields
      licenseNumber: [''],
      experienceYears: [0],

      // Dispatcher field
      inviteCode: ['']
    });

  }

 
register() {
  this.authService.register(this.registerForm.value).subscribe({
    next: (res: any) => {
      alert(res.message || "✅ Registration Successful!");
    },
    error: (err) => {
      console.log("REGISTER ERROR RESPONSE:", err.error);

      // Case 1: Identity errors (password, duplicate username, etc.)
      if (Array.isArray(err.error)) {
        const messages = err.error.map((e: any) => e.description);
        alert("⚠️ " + messages.join("\n"));
        return;
      }

      // Case 2: Invite code failures (plain string)
      if (typeof err.error === "string") {
        alert("⚠️ " + err.error);
        return;
      }

      // Case 3: Validation errors from backend model state
      if (err.error?.errors) {
        const messages = Object.values(err.error.errors).flat();
        alert("⚠️ " + messages.join("\n"));
        return;
      }

      alert("❌ Registration Failed. Try Again.");
    }
  });
}



  
}
