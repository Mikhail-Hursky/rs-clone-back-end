import { Router } from 'express';
import * as storage from '../storage/mongoDB';

const router = Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  const list = await storage.listAll();

  res.json(list);
});

router.get('/:id', async (req, res) => {
  const list = await storage.getByIdUserLogin(req.params['id']);

  res.json(list);
});

router.put('/:id', async (req, res) =>{
  const user = await storage.updateById(req.params['id'], req.body);

  res.json(user);
});

export default router;
