import { sequelize } from "../db/config.js";
import { Op } from "sequelize";
const models = sequelize.models;


class EmpleadosService {
constructor() {}

async getAllEmpleados() {
try {
    const empleados = await models.Empleados.findAll({
        where:{
            estatus: true
        },
        attributes: ['nombre']
    });
    
    
    return empleados;
} catch (error) {
    console.error("Error al obtener empleados:", error);
    throw new Error("Error al obtener empleados");
}
}

async getEmpleadoById(id) {
    try {
        const empleado = await models.Empleados.findByPk(id);
        
        return empleado;
    } catch (error) {
        throw new Error("Error al obtener el empleado");
    }
}

async createEmpleado(data) {
    try {
        const nuevoEmpleado = await models.Empleados.create(data);
        return nuevoEmpleado;
    } catch (error) {
        console.error("Error al crear el empleado:", error);
        throw new Error("Error al crear el empleado");
    }
}

async updateEmpleado(id, data) {
    try {
        const empleado = await models.Empleados.findByPk(id);
        if (!empleado) {
            throw new Error("Empleado no encontrado");
        }
        
        const empleadoActualizado = await empleado.update(data);
        return empleadoActualizado;
    } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        throw new Error("Error al actualizar el empleado");
    }
}

async deleteEmpleado(id) {
    try {
        const empleado = await models.Empleados.findByPk(id);
        if (!empleado) {
            throw new Error("Empleado no encontrado");
        }
        
        await empleado.destroy();
        return { message: "Empleado eliminado correctamente" };
    } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        throw new Error("Error al eliminar el empleado");
    }
}

}

export default EmpleadosService;