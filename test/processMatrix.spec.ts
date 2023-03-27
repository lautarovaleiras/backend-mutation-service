import { describe, it } from "mocha";
import { expect } from 'chai';
import { MutationController } from '../src/lambdas/mutationApi/lib/MutationController';

describe('MutationController', () => {
  describe('getMatrixDetail', () => {
    it('should return rows, columns and diagonals from the matrix received', () => {
      const matrix = [  ['A', 'T', 'G'],
                        ['C', 'A', 'G'], 
                        ['T', 'T', 'A']];
      const expected = {
        rows:       ['ATG', 'CAG', 'TTA'],
        columns:    ['ACT', 'TAT', 'GGA'],
        diagonals:  ['AAA', 'GAT']
      };
      const result = MutationController.getMatrixDetail(matrix);
      expect(result).to.deep.equal(expected);
    });
  });
});
