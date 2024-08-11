import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AddWorkoutComponent } from './add-workout.component';

describe('AddWorkoutComponent', () => {
  let component: AddWorkoutComponent;
  let fixture: ComponentFixture<AddWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddWorkoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.workOutForm).toBeDefined();
    expect(component.workOutForm.get('username')?.value).toBeNull();
    expect(component.workOutForm.get('wtype')?.value).toBeNull();
    expect(component.workOutForm.get('duration')?.value).toBeNull();
  });

  it('should display required error for username if the field is empty and touched', () => {
    const usernameInput = component.workOutForm.get('username');
    usernameInput?.markAsTouched();
    usernameInput?.setValue('');
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('div.text-red-500')).nativeElement;
    expect(errorElement.textContent).toContain('User Name is required.');
  });

  it('should display minlength error for username if the field has fewer than 3 characters', () => {
    const usernameInput = component.workOutForm.get('username');
    usernameInput?.markAsTouched();
    usernameInput?.setValue('Ab');
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('div.text-red-500')).nativeElement;
    expect(errorElement.textContent).toContain('User Name must be at least 3 characters long.');
  });

  it('should display pattern error for username if the field has invalid characters', () => {
    const usernameInput = component.workOutForm.get('username');
    usernameInput?.markAsTouched();
    usernameInput?.setValue('User@Name');
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('div.text-red-500')).nativeElement;
    expect(errorElement.textContent).toContain('Please enter a valid Username.');
  });

  it('should display required error for workout type if the field is not selected and touched', () => {
    const wtypeSelect = component.workOutForm.get('wtype');
    wtypeSelect?.markAsTouched();
    wtypeSelect?.setValue('');
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('div.text-red-500')).nativeElement;
    expect(errorElement.textContent).toContain('Workout Type is required.');
  });

  it('should display required error for workout minutes if the field is empty and touched', () => {
    const durationInput = component.workOutForm.get('duration');
    durationInput?.markAsTouched();
    durationInput?.setValue('');
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('div.text-red-500')).nativeElement;
    expect(errorElement.textContent).toContain('Workout minutes are required.');
  });

  it('should display pattern error for workout minutes if the field has non-numeric values', () => {
    const durationInput = component.workOutForm.get('duration');
    durationInput?.markAsTouched();
    durationInput?.setValue('abc');
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('div.text-red-500')).nativeElement;
    expect(errorElement.textContent).toContain('Please enter a valid number.');
  });

  it('should enable the submit button if the form is valid', () => {
    component.workOutForm.get('username')?.setValue('ValidUser');
    component.workOutForm.get('wtype')?.setValue('Cardio');
    component.workOutForm.get('duration')?.setValue('30');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeFalse();
  });

  it('should disable the submit button if the form is invalid', () => {
    component.workOutForm.get('username')?.setValue('');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('should call onSubmit() when the form is submitted and valid', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    component.workOutForm.get('username')?.setValue('ValidUser');
    component.workOutForm.get('wtype')?.setValue('Cardio');
    component.workOutForm.get('duration')?.setValue('30');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
