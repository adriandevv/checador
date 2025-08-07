import express from 'express';
import EmpleadosRouter from './empleados.router.js';
import AuthRouter from './auth.router.js';
import UsuariosRouter from './usuarios.router.js';
import AdminBlacklistRouter from './admin-blacklist.router.js';


function routerApi (app){
const router = express.Router();

app.use('/api/v1', router);

router.use('/auth', AuthRouter);
router.use('/usuarios', UsuariosRouter);
router.use('/empleados', EmpleadosRouter);
router.use('/admin/blacklist', AdminBlacklistRouter);

}



export default routerApi;