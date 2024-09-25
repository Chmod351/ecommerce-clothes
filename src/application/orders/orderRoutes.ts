import { Router } from 'express';
import idChecker from '../../helpers/idChecker';
import orderController from './orderControllers';

const routes = Router();

routes.get('/', idChecker.isUserAdmin, orderController.findAll);
routes.get('/monthly-sales', idChecker.isUserAdmin, orderController.getMonthlySalesReport);
routes.put('/update', idChecker.isUserAdmin, orderController.updateOrderStatus);
routes.post('/create', orderController.createOrder);
routes.delete('/delete/:id', idChecker.containsIdInParams, idChecker.isUserAdmin, orderController.deleteOrder);

export default routes;
