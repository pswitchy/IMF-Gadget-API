import express from 'express';
import * as GadgetController from '../controllers/gadget.controller';

const router = express.Router();

router.get('/', GadgetController.getGadgets);
router.post('/', GadgetController.createGadget);
router.patch('/:id', GadgetController.updateGadget);
router.delete('/:id', GadgetController.deleteGadget);
router.post('/:id/self-destruct', GadgetController.selfDestructGadget);

export default router;