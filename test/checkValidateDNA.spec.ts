import { describe, it } from "mocha";
import { expect } from 'chai';
import { MutationController } from '../src/lambdas/mutationApi/lib/MutationController';

describe('MutationController', () => {
  describe('validateDNA', () => {
    it('should return true, if dna contains these letters', () => {
      const sequence = ['ATGCAGTTA','ACTTATGGA']
      const expected = true;
      const result = MutationController.validateDna(sequence);
      expect(result).to.deep.equal(expected);
    });
  });
});
