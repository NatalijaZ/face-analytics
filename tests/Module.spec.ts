import { getName } from '../src/Module';
import Chai from 'chai';

describe('Testing Module.ts', () => {
  describe('#getName()', () => {
    it('should equal names', () => {
      Chai.assert.equal(getName(), process.env.MY_NAME);
    });
  });
});
