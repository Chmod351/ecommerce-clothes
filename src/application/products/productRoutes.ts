import { Router } from 'express';
import idChecker from '../../helpers/idChecker';
import productsController from './productControllers';
const routes = Router();

routes.get('/', productsController.findAll);
routes.get('/search', productsController.findByQuery);
routes.get('/:id', idChecker.containsIdInParams, productsController.findById);
routes.post('/create', idChecker.isUserAdmin, productsController.create);
routes.put('/update/:id', idChecker.containsIdInParams, productsController.update);
routes.delete('/delete/:id', idChecker.containsIdInParams, productsController.delete);

export default routes;
