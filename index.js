const actividades = [
    { nombre: "Yoga Suave", duracion: 60, intensidad: "Baja", foto: "https://img.freepik.com/foto-gratis/chica-bastante-atractiva-haciendo-yoga-habitacion-luminosa_78826-3257.jpg?semt=ais_hybrid&w=740&q=80" },
    { nombre: "Spinning Intensivo", duracion: 45, intensidad: "Alta", foto: "https://tse1.mm.bing.net/th/id/OIP.adtNCSp3gdGN8K_Aam4I4wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { nombre: "CrossFit Funcional", duracion: 50, intensidad: "Alta", foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmeaJJedejZWQk6KZ5VIoiSU3JDZFm657pCQ&s" },
    { nombre: "Pilates Máquinas", duracion: 55, intensidad: "Media", foto: "https://media.istockphoto.com/id/1478160381/es/foto/mujer-entrenando-pilates-en-la-cama-reformador-m%C3%A1quina-de-estudio-de-pilates-reformador-para.jpg?s=612x612&w=0&k=20&c=MI7itx7ZP3KvE5cLOc5e_CvJMldl4i3TImbOAUuCEII=" },
    { nombre: "Zumba Fitness", duracion: 40, intensidad: "Media", foto: "https://media.istockphoto.com/id/618745062/es/foto/grupo-de-personas-en-la-clase-de-baile-urbano.jpg?s=612x612&w=0&k=20&c=oSPVS3Ffp96TSR283Yzhkm7oJ4opFaxp3_6Io0IZNVs=" }
];

const franjasHorarias = ["09:00", "11:00", "13:00", "17:00", "19:00"];

// Objeto que almacenara las reservas de cada franja
const reservas = {};

// Inicializar el objeto reservas con arrays vacios para cada franja
franjasHorarias.forEach(franja => {
    reservas[franja] = [];
});

//funcion para inicializar la aplicacion
function inicializarAplicacion() {
    console.log('Iniciando aplicacion');
    poblarTablaActividades();
    poblarSelectorActividades();
    crearFranjasHorarias();
    configurarEventListeners();
    console.log('Aplicacion inicializada correctamente');
}

//funcion para poblar la tabla de actividades
function poblarTablaActividades() {
    const tbody = document.querySelector('#activitiesTableBody');
    tbody.innerHTML = '';
    
    actividades.forEach(act => {
        tbody.innerHTML += `
            <tr>
                <td>${act.nombre}</td>
                <td>${act.duracion}</td>
                <td>${act.intensidad}</td>
                <td><img src="${act.foto}" alt="${act.nombre}"></td>
            </tr>
        `;
    });
}

//funcion para poblar con opciones el selector de actividades
function poblarSelectorActividades() {
    const selector = document.querySelector('#activitySelect');
    let optionsHTML = '';
    
    actividades.forEach((act, index) => {
        optionsHTML += `<option value="${index}">${act.nombre}</option>`;
    });
    
    selector.innerHTML = optionsHTML;
}

//funcion para crear las franjas horarias en tarjetas y dinamicamente
function crearFranjasHorarias() {
    console.log('Creando franjas horarias...');
    const contenedor = document.querySelector('#timeSlots');
    let tarjetasHTML = '';
    
    // Usamos el indice en el array, de cada franja como identificador
    franjasHorarias.forEach((franja, index) => {
        tarjetasHTML += `
            <div class="time-slot" data-index="${index}">
                <div class="time-slot-hour">${franja}</div>
                <div class="reservas-list"></div>
            </div>
        `;
    });
    
    contenedor.innerHTML = tarjetasHTML;
    console.log('Franjas creadas con índices:', franjasHorarias);
}

//funcion para configurar los event listeners
function configurarEventListeners() {
    console.log('Configurando event listeners...');
    
    //boton de toggle para mostrar/ocultar lista de actividades
    const toggleButton = document.querySelector('#toggleButton');
    toggleButton.addEventListener('click', toggleActivitiesList);
    
    //boton para registrar reserva
    const registerButton = document.querySelector('#registerButton');
    registerButton.addEventListener('click', registerReservation);
    console.log('Event listener del botón de registro configurado');
    
    //event listeners para las tarjetas de franjas horarias
    const tarjetas = document.querySelectorAll('.time-slot');
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', function(e) {
            // Solo abrir modal si NO se hace clic en una reserva
            if (!e.target.closest('.reservation-item')) {
                // Obtenemos el indice desde el dataset
                const index = parseInt(this.dataset.index);
                // Obtenemos la franja correspondiente del array
                const franja = franjasHorarias[index];
                console.log(`Click en tarjeta con índice ${index}, franja: ${franja}`);
                abrirModal(franja);
            }
        });
    });
    
    //boton de cerrar modal
    const closeButton = document.querySelector('#closeButton');
    closeButton.addEventListener('click', closeModal);
    
    //cerrar al hacer clic fuera del modal
    const modal = document.querySelector('#detailsModal');
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    console.log('Todos los event listeners configurados');
}

//funcion para mostrar/ocultar lista de actividades
function toggleActivitiesList() {
    const columna = document.querySelector('#leftColumn');
    columna.classList.toggle('hidden');
}

//funcion para registrar una nueva reserva
function registerReservation() {
    console.log('Registrando una nueva reserva');
    
    // obtener valores de los selectores
    const actIndex = document.querySelector('#activitySelect').value;
    const personas = parseInt(document.querySelector('#peopleSelect').value);
    const franja = document.querySelector('#timeSlotSelect').value;
    
    console.log('Valores seleccionados:', { actIndex, personas, franja });
    
    // obtener la actividad del array
    const actividad = actividades[actIndex];
    console.log('Actividad seleccionada:', actividad);
    
    // crear el objeto reserva
    const reserva = {
        actividad: actividad.nombre,
        personas: personas,
        duracion: actividad.duracion,
        cargaTotal: actividad.duracion * personas
    };
    
    console.log('Objeto reserva creado:', reserva);
    
    // agregar la reserva al array de la franja correspondiente
    reservas[franja].push(reserva);
    console.log(`Reserva agregada al array de ${franja}:`, reservas[franja]);
    
    // encontrar el índice de la franja seleccionada
    const indexFranja = franjasHorarias.indexOf(franja);
    console.log(`Índice de la franja ${franja}: ${indexFranja}`);
    
    // actualizar la visualización usando el índice
    actualizarVisualizacionFranja(indexFranja);
}

//funcion para actualizar visualizacion de una franja horaria   
function actualizarVisualizacionFranja(index) {
    console.log(`Actualizando la franja ${index} `);
    
    // Obtener la franja correspondiente al índice
    const franja = franjasHorarias[index];
    console.log(`Franja correspondiente: ${franja}`);
    
    // Buscar la tarjeta usando data-index
    // Dentro de esa tarjeta, buscar el div con clase "reservas-list"
    
    const tarjeta = document.querySelector(`[data-index="${index}"]`);
    console.log('Tarjeta encontrada:', tarjeta);
    
    if (!tarjeta) {
        console.error(`ERROR: No se encontró la tarjeta con data-index="${index}"`);
        return;
    }
    
    // Buscar el contenedor de reservas DENTRO de la tarjeta
    const contenedor = tarjeta.querySelector('.reservas-list');
    console.log('Contenedor de reservas encontrado:', contenedor);
    
    if (!contenedor) {
        console.error('ERROR: No se encontró el contenedor .reservas-list dentro de la tarjeta');
        return;
    }
    
    const reservasFranja = reservas[franja];
    console.log(`Reservas en la franja ${franja}:`, reservasFranja);
    
    // Limpiar contenido previo
    contenedor.innerHTML = '';
    console.log('Contenedor limpiado');
    
    // Si no hay reservas, mostrar mensaje
    if (reservasFranja.length === 0) {
        contenedor.innerHTML = '<p class="sin-reservas">Sin reservas</p>';
        return;
    }
    
    // Crear HTML para cada reserva
    let reservasHTML = '';
    
    reservasFranja.forEach((res, idx) => {
        console.log(`Procesando reserva ${idx}:`, res);
        reservasHTML += `
            <div class="reservation-item">
                ${res.actividad} x${res.personas} persona${res.personas > 1 ? 's' : ''}
            </div>
        `;
    });
    
    console.log('HTML generado:', reservasHTML);
    
    // Insertar el HTML
    contenedor.innerHTML = reservasHTML;
    console.log('HTML insertado en el contenedor');
    console.log('Estado final del contenedor:', contenedor.innerHTML);
}

//funcion para abrir el modal con detalles de reservas
function abrirModal(franja) {
    console.log(`Abriendo modal para franja: ${franja}`);
    
    const reservasFranja = reservas[franja];
    
    // Si no hay reservas, mostrar alerta
    if (reservasFranja.length === 0) {
        alert('No hay reservas para esta franja horaria.');
        return;
    }
    
    // Actualizar el titulo del modal
    document.querySelector('#modalTitle').textContent = `Detalles de reservas para las ${franja}`;
    
    // Obtener el tbody de la tabla del modal
    const tbody = document.querySelector('#modalTableBody');
    tbody.innerHTML = '';
    
    // Generar las filas de la tabla
    let filasHTML = '';
    let totalMinutos = 0;
    
    reservasFranja.forEach(res => {
        filasHTML += `
            <tr>
                <td>${res.actividad}</td>
                <td>${res.personas}</td>
                <td>${res.duracion}</td>
                <td>${res.cargaTotal}</td>
            </tr>
        `;
        
        totalMinutos += res.cargaTotal;
    });
    
    tbody.innerHTML = filasHTML;
    
    // Actualizar el total acumulado
    document.querySelector('#totalMinutes').textContent = `${totalMinutos} min`;
    
    // Mostrar el modal
    document.querySelector('#detailsModal').classList.add('show');
}

//funcion para cerrar el modal
function closeModal() {
    const modal = document.querySelector('#detailsModal');
    modal.classList.remove('show');
}

//funcion para iniciar la aplicacion al cargar el DOM
inicializarAplicacion();