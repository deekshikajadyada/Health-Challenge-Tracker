import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
})
export class WorkoutListComponent implements OnInit, AfterViewInit {
  searchTerm = '';
  itemsPerPage = 5;
  displayedColumns: string[] = ['username', 'wtype', 'duration'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadWorkouts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadWorkouts() {
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

    const filteredWorkouts = allWorkouts.filter(
      (workout: { username: string; wtype: string; duration: number }) =>
        workout.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.dataSource.data = filteredWorkouts;
  }
}
