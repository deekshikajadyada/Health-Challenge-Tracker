import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WorkoutListComponent } from './workout-list.component';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule], // Import FormsModule for ngModel
      declarations: [WorkoutListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table headers correctly', () => {
    const headers = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headers[0].nativeElement.textContent.trim()).toBe('Username');
    expect(headers[1].nativeElement.textContent.trim()).toBe('Workout Type');
    expect(headers[2].nativeElement.textContent.trim()).toBe('Duration (minutes)');
  });

  it('should render workouts in the table body', () => {
    component.paginatedWorkouts = [
      { username: 'User1', wtype: 'Cardio', duration: 30 },
      { username: 'User2', wtype: 'Strength', duration: 45 }
    ];
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].nativeElement.textContent).toContain('User1');
    expect(rows[0].nativeElement.textContent).toContain('Cardio');
    expect(rows[0].nativeElement.textContent).toContain('30');
    expect(rows[1].nativeElement.textContent).toContain('User2');
    expect(rows[1].nativeElement.textContent).toContain('Strength');
    expect(rows[1].nativeElement.textContent).toContain('45');
  });

  it('should filter workouts based on search term', () => {
    component.workouts = [
      { username: 'User1', wtype: 'Cardio', duration: 30 },
      { username: 'User2', wtype: 'Strength', duration: 45 }
    ];
    component.searchTerm = 'User1';
    component.filterWorkouts();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('User1');
  });

  it('should handle empty search term and show all workouts', () => {
    component.workouts = [
      { username: 'User1', wtype: 'Cardio', duration: 30 },
      { username: 'User2', wtype: 'Strength', duration: 45 }
    ];
    component.searchTerm = '';
    component.filterWorkouts();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
  });

  it('should update pagination controls', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    fixture.detectChanges();

    const pageInfo = fixture.debugElement.query(By.css('span')).nativeElement.textContent.trim();
    expect(pageInfo).toBe('Page 1 of 3');
  });

  it('should disable previous button on first page', () => {
    component.currentPage = 1;
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('button:nth-of-type(1)')).nativeElement;
    expect(prevButton.disabled).toBeTrue();
  });

  it('should disable next button on last page', () => {
    component.currentPage = 3;
    component.totalPages = 3;
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('button:nth-of-type(3)')).nativeElement;
    expect(nextButton.disabled).toBeTrue();
  });

  it('should navigate to previous page', () => {
    component.currentPage = 2;
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('button:nth-of-type(1)')).nativeElement;
    prevButton.click();
    fixture.detectChanges();

    expect(component.currentPage).toBe(1);
  });

  it('should navigate to next page', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(By.css('button:nth-of-type(3)')).nativeElement;
    nextButton.click();
    fixture.detectChanges();

    expect(component.currentPage).toBe(2);
  });
});
