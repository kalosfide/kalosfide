import { TestBed, inject } from '@angular/core/testing';

import { MotDePasseService } from './mot-de-passe.service';

describe('MotDePasseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotDePasseService]
    });
  });

  it('should be created', inject([MotDePasseService], (service: MotDePasseService) => {
    expect(service).toBeTruthy();
  }));
});
