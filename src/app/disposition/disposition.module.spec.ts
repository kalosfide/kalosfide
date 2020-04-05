import { DispositionModule } from './disposition.module';

describe('DispositionModule', () => {
  let dispositionModule: DispositionModule;

  beforeEach(() => {
    dispositionModule = new DispositionModule();
  });

  it('should create an instance', () => {
    expect(dispositionModule).toBeTruthy();
  });
});
