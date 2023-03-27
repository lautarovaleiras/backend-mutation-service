import { Request, Response,API} from 'lambda-api';
import { MutationController } from "./lib/MutationController";

const api = require('lambda-api')();

/** for implement middlewate */
api.use((err,req,res,next) => next())
// modern module syntax

api.post('/mutation', async (req: Request, res: Response) => {
  const { dna } = req.body;
  
  if (!dna || !Array.isArray(dna)) return res.status(400).send("invalid_format")

  const isValidDna = MutationController.validateDna(dna)

  if(!isValidDna) return res.status(400).send("invalid_dna_sequence")

  // 1. Generate Matrix with 
  const matrixDna= MutationController.buildMatrix(dna)

  // 2. Check if has mutation
  const hasMutation = MutationController.hasMutation(matrixDna)

  // 3. Save into DynamoDB
    try {
      await MutationController.saveDna({sequence:dna.join(''),mutation:hasMutation})
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }

  // 4. Reponse 
  if(!hasMutation) return res.sendStatus(403)
  return res.sendStatus(200)
});


api.get('/stats', async (req: Request, res: Response) => {

  let stats;
  try {
    stats = await MutationController.buildStats()
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
  return res.status(200).send({stats})
});


export async function handler (event, context) {
  console.log(event);
  return await api.run(event, context);
};