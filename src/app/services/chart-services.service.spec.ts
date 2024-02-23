import { TestBed } from '@angular/core/testing';

import { ChartServicesService } from './chart-services.service';

describe('ChartServicesService', () => {
  let service: ChartServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
