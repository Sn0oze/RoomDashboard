import { TestBed } from '@angular/core/testing';

import { Scene2Service } from './scene2.service';

describe('Scene2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Scene2Service = TestBed.get(Scene2Service);
    expect(service).toBeTruthy();
  });
});
