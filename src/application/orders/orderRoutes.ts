import { Router } from 'express';
import idChecker from '../../helpers/idChecker';
import orderController from './orderControllers';

const routes = Router();

routes.get('/', orderController.findAll);
routes.put('/update/:id', idChecker.containsIdInParams, orderController.updateOrderStatus);
routes.post('/create', orderController.createOrder);
routes.delete('/delete/:id', idChecker.containsIdInParams, orderController.deleteOrder);

export default routes;
