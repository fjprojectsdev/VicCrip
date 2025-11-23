// Modo manutenção
let maintenanceMode = false;

export function enableMaintenance() {
    maintenanceMode = true;
}

export function disableMaintenance() {
    maintenanceMode = false;
}

export function isMaintenanceMode() {
    return maintenanceMode;
}
