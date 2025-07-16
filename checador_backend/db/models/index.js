import { Usuarios, UsuariosSchema } from "./usuarios.model.js";
import { TipoUsuarios, TipoUsuariosSchema } from "./tipo_usuarios.model.js";
import { Empleados, EmpleadosSchema } from "./empleados.model.js";
import { Coordenadas, CoordenadasSchema } from "./coordenadas.model.js";
import { Zonas, ZonasSchema } from "./zonas.model.js";
import { Imagenes, ImagenesSchema } from "./imagenes.model.js";
import { Huellas, HuellasSchema } from "./huellas.model.js";
import { Dispositivos, DispositivosSchema } from "./dispositivos.model.js";
import { Registros, RegistrosSchema } from "./registros.model.js";
import { Turnos, TurnosSchema } from "./turnos.model.js";
import { CuerpoAlertas, CuerpoAlertasSchema } from "./cuerpo_alertas.model.js";
import { AlertasEspecificas, AlertasEspecificasSchema } from "./alertas_especificas.model.js";
import { AlertasGenerales, AlertasGeneralesSchema } from "./alertas_generales.model.js";
import { Direccion, DireccionSchema } from "./direccion.model.js";
import { Permisos, PermisosSchema } from "./permisos.model.js";

function setupModels (sequelize){
// aqui se se inicializan los modelos
    Usuarios.init(UsuariosSchema, Usuarios.config(sequelize));
    TipoUsuarios.init(TipoUsuariosSchema, TipoUsuarios.config(sequelize));
    Empleados.init(EmpleadosSchema, Empleados.config(sequelize));
    Coordenadas.init(CoordenadasSchema, Coordenadas.config(sequelize));
    Zonas.init(ZonasSchema, Zonas.config(sequelize));
    Imagenes.init(ImagenesSchema, Imagenes.config(sequelize));
    Huellas.init(HuellasSchema, Huellas.config(sequelize));
    Dispositivos.init(DispositivosSchema, Dispositivos.config(sequelize));
    Registros.init(RegistrosSchema, Registros.config(sequelize));
    Turnos.init(TurnosSchema, Turnos.config(sequelize));
    CuerpoAlertas.init(CuerpoAlertasSchema, CuerpoAlertas.config(sequelize));
    AlertasEspecificas.init(AlertasEspecificasSchema, AlertasEspecificas.config(sequelize));
    AlertasGenerales.init(AlertasGeneralesSchema, AlertasGenerales.config(sequelize));
    Direccion.init(DireccionSchema, Direccion.config(sequelize));
    Permisos.init(PermisosSchema, Permisos.config(sequelize));

// aqui se crean las relaciones entre los modelos
    Usuarios.associate(sequelize.models);
    TipoUsuarios.associate(sequelize.models);
    Empleados.associate(sequelize.models);
    Coordenadas.associate(sequelize.models);
    Zonas.associate(sequelize.models);
    Imagenes.associate(sequelize.models);
    Huellas.associate(sequelize.models);
    Dispositivos.associate(sequelize.models);
    Registros.associate(sequelize.models);
    Turnos.associate(sequelize.models);
    CuerpoAlertas.associate(sequelize.models);
    AlertasEspecificas.associate(sequelize.models);
    AlertasGenerales.associate(sequelize.models);
    Direccion.associate(sequelize.models);
    Permisos.associate(sequelize.models);
}


export default setupModels;