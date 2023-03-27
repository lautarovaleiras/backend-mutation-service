import { describe, it } from "mocha";
import { expect } from 'chai';

import { MutationController } from '../src/lambdas/mutationApi/lib/MutationController';

describe('MutationController', () => {
  describe('buildMatrix', () => {
    it('should return the expected matrix', () => {
      const list = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];
      const expectedMatrix = [        ['A', 'T', 'G', 'C', 'G', 'A'],
        ['C', 'A', 'G', 'T', 'G', 'C'],
        ['T', 'T', 'A', 'T', 'G', 'T'],
        ['A', 'G', 'A', 'A', 'G', 'G'],
        ['C', 'C', 'C', 'C', 'T', 'A'],
        ['T', 'C', 'A', 'C', 'T', 'G'],
      ];
      const matrix = MutationController.buildMatrix(list);
      expect(matrix).to.deep.equal(expectedMatrix);
    });
  });
});
