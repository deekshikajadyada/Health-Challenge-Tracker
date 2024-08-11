import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Chart, registerables } from 'chart.js';
import { UserProgressComponent } from './user-progress.component';
import { CommonModule } from '@angular/common';

describe('UserProgressComponent', () => {
  let component: UserProgressComponent;
  let fixture: ComponentFixture<UserProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, UserProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users and load chart data on ngOnInit', () => {
    spyOn(component, 'loadUsers').and.callThrough();
    spyOn(component, 'loadChartData').and.callThrough();

    component.ngOnInit();

    expect(component.loadUsers).toHaveBeenCalled();
    expect(component.loadChartData).toHaveBeenCalled();
  });

  it('should populate users and select the first user on loadUsers', () => {
    const mockWorkouts = [
      { name: 'User1', workouts: [{ type: 'Cardio', minutes: 30 }] },
      { name: 'User2', workouts: [{ type: 'Strength', minutes: 45 }] }
    ];
    spyOn(component, 'getWorkouts').and.returnValue(mockWorkouts);
    
    component.loadUsers();

    expect(component.users).toEqual(['User1', 'User2']);
    expect(component.selectedUser).toBe('User1');
  });

  it('should load chart data for the selected user', () => {
    spyOn(component, 'getWorkouts').and.returnValue([
      { name: 'User1', workouts: [{ type: 'Cardio', minutes: 30 }] }
    ]);

    const loadChartDataSpy = spyOn(component.chart, 'destroy');
    spyOn(Chart, 'register').and.callThrough();
    spyOn(Chart, 'constructor').and.callThrough();

    component.loadChartData('User1');

    expect(Chart.register).toHaveBeenCalledWith(...registerables);
    expect(Chart).toHaveBeenCalledWith('myChart', jasmine.any(Object));
    expect(loadChartDataSpy).toHaveBeenCalled();
  });

  it('should update chart data on user selection change', () => {
    spyOn(component, 'loadChartData').and.callThrough();
    
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    selectElement.value = 'User2';
    selectElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.selectedUser).toBe('User2');
    expect(component.loadChartData).toHaveBeenCalledWith('User2');
  });

  it('should call getWorkouts and parse local storage data', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { name: 'User1', workouts: [{ type: 'Cardio', minutes: 30 }] }
    ]));
    
    const workouts = component.getWorkouts();

    expect(workouts).toEqual([
      { name: 'User1', workouts: [{ type: 'Cardio', minutes: 30 }] }
    ]);
  });

  it('should handle empty local storage gracefully', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const workouts = component.getWorkouts();

    expect(workouts).toEqual([]);
  });

  it('should create chart on initialization and destroy it before creating a new one', () => {
    spyOn(Chart.prototype, 'destroy');
    spyOn(Chart, 'constructor').and.callThrough();
    
    component.loadChartData('User1');
  
    expect(Chart.prototype.destroy).toHaveBeenCalled();
    expect(Chart).toHaveBeenCalledWith('myChart', jasmine.any(Object));
  });
});
