import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        AuthService,
        {
          provide: Router,
          useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') },
        },
      ],
    });

    localStorage.clear();
  });

  it('should initialize as logged out when no token is in localStorage', () => {
    const service = TestBed.inject(AuthService);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should initialize as logged in when token exists in localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('role', 'user');

    const service = TestBed.inject(AuthService);
    expect(service.isLoggedIn()).toBeTrue();
  });
});
