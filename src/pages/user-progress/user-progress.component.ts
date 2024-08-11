import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-user-progress',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule],
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.css'],
})
export class UserProgressComponent implements OnInit {
  users: string[] = [];
  selectedUser: string = '';
  chart: any;
  chartsFound: boolean = false;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const workouts = this.getWorkouts();
    this.users = Array.from(new Set(workouts.map((user: any) => user.name)));
    if (this.users.length > 0) {
      this.selectedUser = this.users[0];
      this.loadChartData(this.selectedUser);
    }
  }

  loadChartData(userName: string) {
    const workouts = this.getWorkouts();
    const userWorkouts =
      workouts.find((user: any) => user.name === userName)?.workouts || [];

    this.chartsFound = userWorkouts.length > 0;

    if (!this.chartsFound) {
      if (this.chart) {
        this.chart.destroy();
      }
      return;
    }

    const data = userWorkouts.map((workout: any) => ({
      type: workout.type,
      minutes: workout.minutes,
    }));

    Chart.register(...registerables);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: data.map((workout: { type: any }) => workout.type),
        datasets: [
          {
            label: `Workouts for ${userName}`,
            data: data.map((workout: { minutes: any }) => workout.minutes),
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  onUserChange(event: any) {
    this.selectedUser = event.target.value;
    this.loadChartData(this.selectedUser);
  }

  getWorkouts() {
    try {
      return JSON.parse(localStorage.getItem('userData') || '[]');
    } catch (error) {
      console.error('Error parsing userData from localStorage', error);
      return [];
    }
  }
}
