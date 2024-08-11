import { Routes } from '@angular/router';
import { WorkoutListComponent } from '../pages/workout-list/workout-list.component';
import { AddWorkoutComponent } from '../pages/add-workout/add-workout.component';
import { UserProgressComponent } from '../pages/user-progress/user-progress.component';

export const routes: Routes = [
  { path: '', redirectTo: 'workout-list', pathMatch: 'full' },
  { path: 'workout-list', component: WorkoutListComponent },
  { path: 'add-workout', component: AddWorkoutComponent },
  { path: 'workout-chart', component: UserProgressComponent },
];
