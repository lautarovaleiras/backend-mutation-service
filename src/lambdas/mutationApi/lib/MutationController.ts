import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ScanOptions } from "dynamodb-toolbox/dist/classes/Table";
import { DBController } from "../../../shared/DBController";


export class MutationController  {

  /**
   *  checks for four consecutive repeated letters
   * @param text sequence of dna
   * @returns boolean 
   */
  static checkRepeatedLetters(text:string){
    // Check 4 consecutives duplicated
    return new RegExp(/([a-z])\1\1\1/gi).test(text)
  }


  /**
   * Returns rows, columns and diagonals from the matrix reicived
   * eg. entry matrix: [[1,2,3],[1,2,3],[7,7,8]]
   */
  static getMatrixDetail(matrix:string[][]):{rows:string[],columns:string[],diagonals:string[]}{
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    // Get rows
    const rows:any []= [];
    for (let i = 0; i < numRows; i++) {
      rows.push(matrix[i]);
      //rows+=matrix[i]
    }

    // Get columns
    //// const arrayColumn = (arr, n) => arr.map(x => x[n]).join('');
    const cols: any[] = [];
    for (let j = 0; j < numCols; j++) {
      const col:any[] = [];
      for (let i = 0; i < numRows; i++) {
        col.push(matrix[i][j]);
      }
      cols.push(col);
    }

    // Get diagonals
    const diagonals:any[] = [];
    const mainDiag:any[]  = [];
    const antiDiag:any[]  = [];
    for (let i = 0; i < numRows; i++) {
      mainDiag.push(matrix[i][i]);
      antiDiag.push(matrix[i][numCols - i - 1]);
    }
    diagonals.push(mainDiag);
    diagonals.push(antiDiag);

    // Return in sequence string format for validate mutation using regex
    return {
      rows: rows.map(elem=>elem.join('')),
      columns: cols.map(elem=>elem.join('')),
      diagonals: diagonals.map(elem=>elem.join(''))
    };
  }

  static hasMutation(matrix:string[][]): boolean {
    let hasMutation:boolean = false;

    const matrixParsed = this.getMatrixDetail(matrix)
    
    const collection = [matrixParsed.rows,matrixParsed.columns,matrixParsed.diagonals].flat()
    
    for (let i=0; i<collection.length ;i++){
      hasMutation = this.checkRepeatedLetters(collection[i])
      if(hasMutation) return hasMutation
    }
    return hasMutation;
  }

  /**
   * 
   * @param list dna = ["ATGCGA","CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
   * @returns  matrix = [
                  [ 'A', 'T', 'G', 'C', 'G', 'A' ],
                  [ 'C', 'A', 'G', 'T', 'G', 'C' ],
                  [ 'T', 'T', 'A', 'T', 'G', 'T' ],
                  [ 'A', 'G', 'A', 'A', 'G', 'G' ],
                  [ 'C', 'C', 'C', 'C', 'T', 'A' ],
                  [ 'T', 'C', 'A', 'C', 'T', 'G' ]
                ]
   */
  static buildMatrix(list: string[]) : string[][]{
    return list.map(elem=>elem.split(''))
  }

  /**
   * 
   * @param dna List of dna sequences 
   * @returns 
   */
  static  validateDna(dna:string[]): boolean{
    
    const validLetters = new Set(['A', 'T', 'C', 'G']);

    for (let sequence of dna) {
      for (let letter of sequence) {
        if (!validLetters.has(letter)) {
          return false;
        }
      }
    }
    return true;
  }

  static saveDna(dna: {sequence: string, mutation: boolean}): Promise<DocumentClient.PutItemInput>{
    return DBController.getInstance().dna_stats.put(dna)
  }

//WARNING
//    When you choose "Start scan," you will perform a DynamoDB scan to determine the most-recent item count. This scan might consume additional table read capacity units.
// It is not recommended to perform this action on very large tables or tables that serve critical production traffic. You can pause the action at any time to avoid consuming extra read capacity.

/**
 * Get cants of dna by mutation
 * @param mutation 
 * @returns 
 */
  static async getCantDnaByMutation(mutation:boolean){
    const options:  ScanOptions ={
      filters:{attr:'mutation',eq:mutation}
    }
    return DBController.getInstance().dna_stats.scan(options).then(response=>{
      return response.Count;
    })
  }



  static async buildStats(){
    const count_mutations = await this.getCantDnaByMutation(true) || 0;
    const count_no_mutations = await this.getCantDnaByMutation(false) || 0;

    return {
      count_mutations,
      count_no_mutations,
      ratio: count_mutations / count_no_mutations
    }


  }



}