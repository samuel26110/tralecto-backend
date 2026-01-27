// admin.js - Versión con CRUD y Sesión

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#leads-table tbody');
    const loadingMessage = document.getElementById('loading-message');
    
    const API_BASE_URL = '/api/leads'; 
    const adminToken = sessionStorage.getItem('adminToken');

    if (!adminToken) {
        alert("Sesión expirada o no iniciada. Por favor, inicie sesión.");
        window.location.href = 'admin-login.html'; // Redirigir al login admin
        return;
    }

    // Inicializar la carga de leads
    fetchAndRenderLeads(adminToken);

    // --- FUNCIÓN PARA CARGAR DATOS ---
    function fetchAndRenderLeads(token) {
        loadingMessage.textContent = "Cargando leads...";
        tableBody.innerHTML = ''; // Limpiar la tabla

        fetch(`${API_BASE_URL}?token=${token}`)
            .then(response => {
                if (response.status === 401) {
                    sessionStorage.removeItem('adminToken'); 
                    alert("Token inválido o expirado. Redirigiendo a login.");
                    window.location.href = 'admin-login.html';
                    return;
                }
                if (!response.ok) {
                    throw new Error("Error de servidor al cargar leads.");
                }
                return response.json();
            })
            .then(leads => {
                loadingMessage.style.display = 'none'; // Ocultar mensaje de carga
                renderTable(leads);
            })
            .catch(error => {
                loadingMessage.textContent = `Error al conectar: ${error.message}`;
                console.error("Error de conexión o carga:", error);
            });
    }

    // --- FUNCIÓN PARA DIBUJAR LA TABLA ---
    function renderTable(leads) {
        tableBody.innerHTML = ''; 
        
        if (leads.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay leads capturados aún.</td></tr>';
            return;
        }

        leads.forEach(lead => {
            const row = tableBody.insertRow();
            row.setAttribute('data-lead-id', lead._id);
            row.setAttribute('data-managed', lead.isManaged); // Para aplicar el estilo de fondo
            
            // 1. Estado (Icono)
            const statusCell = row.insertCell();
            if (lead.isManaged) {
                statusCell.innerHTML = '<i class="fas fa-check-circle" style="color: #28a745;" title="Gestionado"></i>';
            } else {
                statusCell.innerHTML = '<i class="fas fa-clock" style="color: #ffc107;" title="Pendiente"></i>';
            }
            
            // 2. Fecha
            const date = new Date(lead.timestamp).toLocaleDateString('es-ES', { 
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            });
            row.insertCell().textContent = date;
            
            // 3, 4, 5, 6. Datos del Lead
            row.insertCell().textContent = lead.contactName || 'N/A';
            row.insertCell().textContent = lead.contactEmail || 'N/A';
            row.insertCell().textContent = lead.typeOfProject || 'No especificado';
            row.insertCell().textContent = lead.initialMessage.substring(0, 50) + (lead.initialMessage.length > 50 ? '...' : '');

            // 7. Acciones (Botones)
            const actionCell = row.insertCell();
            
            // Botón GESTIONAR (PUT)
            if (!lead.isManaged) {
                 const manageBtn = document.createElement('button');
                manageBtn.className = 'action-btn btn-manage';
                manageBtn.innerHTML = '<i class="fas fa-clipboard-check"></i> Gestionar';
                manageBtn.onclick = () => handleAction(lead._id, 'manage');
                actionCell.appendChild(manageBtn);
            } else {
                actionCell.innerHTML += '<span style="color:#28a745; font-weight: bold;">Listo</span>';
            }
            
            // Botón ELIMINAR (DELETE)
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn btn-delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Eliminar';
            deleteBtn.onclick = () => handleAction(lead._id, 'delete');
            actionCell.appendChild(deleteBtn);
        });
    }
    
    // --- FUNCIÓN PARA MANEJAR LAS ACCIONES CRUD ---
    function handleAction(leadId, actionType) {
        if (actionType === 'delete' && !confirm('¿Estás seguro de que quieres eliminar este lead? Esta acción es irreversible.')) {
            return;
        }
        
        let url = `${API_BASE_URL}/${leadId}`;
        let method = '';
        
        if (actionType === 'delete') {
            method = 'DELETE';
        } else if (actionType === 'manage') {
            method = 'PUT';
            url += '/manage'; // Usar el endpoint de actualización específica
        }
        
        fetch(url, {
            method: method,
            headers: {
                // El token se envía en la cabecera X-Admin-Token para seguridad adicional
                'X-Admin-Token': adminToken, 
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 401) {
                // Manejo de token inválido
                throw new Error("Token de administrador inválido.");
            }
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Error al procesar la solicitud.'); });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            // Volver a cargar la tabla para reflejar el cambio
            fetchAndRenderLeads(adminToken);
        })
        .catch(error => {
            alert(`Error en la acción: ${error.message}`);
            console.error(error);
        });
    }

});
