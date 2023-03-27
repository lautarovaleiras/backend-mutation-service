import { describe, it } from "mocha";
import { expect } from 'chai';
import { MutationController } from '../src/lambdas/mutationApi/lib/MutationController';

describe('MutationController', () => {
  describe('hasMutation', () => {
    it('should return true if there is a mutation in the rows', () => {
      const matrix = [        ['A', 'T', 'G', 'C', 'G', 'A'],
        ['C', 'A', 'G', 'T', 'G', 'C'],
        ['T', 'T', 'A', 'T', 'G', 'T'],
        ['A', 'G', 'A', 'A', 'G', 'G'],
        ['C', 'C', 'C', 'C', 'T', 'A'],
        ['T', 'C', 'A', 'C', 'T', 'G'],
      ];
      const result = MutationController.hasMutation(matrix);
      expect(result).to.equal(true);
    });

    it('should return true if there is a mutation in the columns', () => {
      const matrix = [        ['A', 'T', 'G', 'C', 'G', 'T'],
        ['C', 'A', 'G', 'T', 'G', 'C'],
        ['T', 'T', 'A', 'T', 'G', 'T'],
        ['A', 'G', 'A', 'A', 'G', 'G'],
        ['C', 'C', 'C', 'C', 'T', 'A'],
        ['T', 'C', 'A', 'C', 'T', 'G'],
      ];
      const result = MutationController.hasMutation(matrix);
      expect(result).to.equal(true);
    });

    it('should return true if there is a mutation in the diagonals', () => {
      const matrix = [        ['A', 'T', 'G', 'C', 'G', 'A'],
        ['C', 'A', 'G', 'T', 'G', 'C'],
        ['T', 'T', 'A', 'T', 'G', 'T'],
        ['A', 'G', 'A', 'A', 'G', 'G'],
        ['C', 'C', 'C', 'C', 'T', 'A'],
        ['T', 'C', 'A', 'C', 'T', 'G'],
      ];
      const result = MutationController.hasMutation(matrix);
      expect(result).to.equal(true);
    });

    it('should return false if there is no mutation in the matrix', () => {
      const matrix = [  ['A', 'T', 'G', 'C'],
                        ['C', 'G', 'G', 'T'],
                        ['T', 'T', 'A', 'T'],
                        ['A', 'G', 'A', 'A'],
      ];
      const result = MutationController.hasMutation(matrix);
      expect(result).to.equal(false);
    });
  });
});
