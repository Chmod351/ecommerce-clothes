import { Router } from 'express';
import idChecker from '../../helpers/idChecker';
import productsController from './productControllers';
const routes = Router();

routes.get('/', productsController.findAll);
routes.get('/search', productsController.findByQuery);
routes.post('/create', idChecker.isUserAdmin, productsController.create);
routes.get('/id/:id', idChecker.containsIdInParams, productsController.findById);
routes.put('/update/:id', idChecker.containsIdInParams, idChecker.isUserAdmin, productsController.update);

// routes.delete('/delete/:id', idChecker.containsIdInParams, productsController.delete);

export default routes;
