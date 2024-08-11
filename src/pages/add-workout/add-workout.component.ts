import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './add-workout.component.html',
  styleUrls: ['./add-workout.component.css'],
})
export class AddWorkoutComponent {
  workOutForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    wtype: new FormControl('', [Validators.required]),
    duration: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
  });

  onSubmit(event: any) {

    event.preventDefault();
    if (this.workOutForm.invalid) {
      this.workOutForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }

    const workoutData = this.workOutForm.value;

    const duration = workoutData.duration
      ? workoutData.duration.toString()
      : '0';

    const userData = JSON.parse(localStorage.getItem('userData') || '[]');

    let user = userData.find((u: any) => u.name === workoutData.username);

    if (user) {
      user.workouts.push({
        type: workoutData.wtype || '',
        minutes: parseInt(duration) || 0,
      });
    } else {
      user = {
        id: userData.length + 1,
        name: workoutData.username || '',
        workouts: [
          {
            type: workoutData.wtype || '',
            minutes: parseInt(duration) || 0,
          },
        ],
      };
      userData.push(user);
    }

    localStorage.setItem('userData', JSON.stringify(userData));

    this.workOutForm.reset();

    console.log('Data saved to localStorage');
  }

  getWorkouts() {
    return JSON.parse(localStorage.getItem('userData') || '[]');
  }
}
