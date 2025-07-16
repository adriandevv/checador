import express from 'express';
import EmpleadosRouter from './empleados.router.js';


function routerApi (app){
const router = express.Router();

app.use('/api/v1', router);

router.use('/empleados', EmpleadosRouter);

}



export default routerApi;