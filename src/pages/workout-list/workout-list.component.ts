import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
})
export class WorkoutListComponent {
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  filteredWorkouts: any[] = [];
  paginatedWorkouts: any[] = [];
  totalPages: number = 0; // Declare totalPages

  ngOnInit() {
    this.filterWorkouts();
  }

  getWorkouts() {
    return JSON.parse(localStorage.getItem('userData') || '[]');
  }

  filterWorkouts() {
    const allWorkouts = this.getWorkouts().flatMap((user: any) =>
      user.workouts.map((workout: any) => ({
        username: user.name,
        wtype: workout.type,
        duration: workout.minutes,
      }))
    );

    this.filteredWorkouts = allWorkouts.filter(
      (workout: { username: string; wtype: string; duration: number }) =>
        workout.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.paginateWorkouts();
  }

  paginateWorkouts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedWorkouts = this.filteredWorkouts.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(
      this.filteredWorkouts.length / this.itemsPerPage
    );
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateWorkouts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateWorkouts();
    }
  }
}
