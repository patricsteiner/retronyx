import { TestBed } from '@angular/core/testing';

import { RetroBoardService } from './retro-board.service';

describe('RetroBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RetroBoardService = TestBed.get(RetroBoardService);
    expect(service).toBeTruthy();
  });
});
