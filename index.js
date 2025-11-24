const actividades = [
    { nombre: "Yoga Suave", duracion: 60, intensidad: "Baja", foto: "ttps://img.freepik.com/foto-gratis/chica-bastante-atractiva-haciendo-yoga-habitacion-luminosa_78826-3257.jpg?semt=ais_hybrid&w=740&q=80" },
    { nombre: "Spinning Intensivo", duracion: 45, intensidad: "Alta", foto: "https://tse1.mm.bing.net/th/id/OIP.adtNCSp3gdGN8K_Aam4I4wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { nombre: "CrossFit Funcional", duracion: 50, intensidad: "Alta", foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmeaJJedejZWQk6KZ5VIoiSU3JDZFm657pCQ&s" },
    { nombre: "Pilates Máquinas", duracion: 55, intensidad: "Media", foto: "https://media.istockphoto.com/id/1478160381/es/foto/mujer-entrenando-pilates-en-la-cama-reformador-m%C3%A1quina-de-estudio-de-pilates-reformador-para.jpg?s=612x612&w=0&k=20&c=MI7itx7ZP3KvE5cLOc5e_CvJMldl4i3TImbOAUuCEII=" },
    { nombre: "Zumba Fitness", duracion: 40, intensidad: "Media", foto: "https://media.istockphoto.com/id/618745062/es/foto/grupo-de-personas-en-la-clase-de-baile-urbano.jpg?s=612x612&w=0&k=20&c=oSPVS3Ffp96TSR283Yzhkm7oJ4opFaxp3_6Io0IZNVs=" }
]; 

const franjasHorarias = ["09:00", "11:00", "13:00", "17:00", "19:00"];
const reservas = {};

franjasHorarias.forEach(franja => {
    reservas[franja] = [];
});

//funcion para inicializar todo
function inicializarAplicacion(){
    console.log('Inicializando Aplicacion');
    poblarTablaActividades();
    poblarSelectorActividades();
    crearFranjasHorarias();
    configurarEventListeners();
    console.log('Aplicacion iniciada correctamente');
}

function poblarTablaActividades(){
    const tbody = document.querySelector('#activitiesTableBody');
    tbody.innerHTML += '';

    actividades.forEach(act => {
        tbody.innerHTML+= `
            <tr>
                <td>${act.nombre}</td>
                <td>${act.duracion}</td>
                <td>${act.intensidad}</td>
                <td><img src="${act.foto}" alt="${act.nombre}" width="100"></td>      
            </tr>
        `;
    });
}

//relleno el label donde selecciono las actividades
function poblarSelectorActividades(){
    const tbody = document.querySelector('#activitySelect');
    let optionsHTML= '';

    actividades.forEach((act, index) => {
        optionsHTML += `<option value="${index}">${act.nombre}</option>`;
    });

    tbody.innerHTML += optionsHTML;
}

//creo las tarjetas e las franjas horarias
function crearFranjasHorarias(){
    console.log('Creando Tarjetas de las Franjas Horarias');
    const contenedor = document.querySelector('#timeSlots');
    let tarjetasHTML = '';
    franjasHorarias.forEach(franja => {
        tarjetasHTML += `
            <div class="time-slot" data-franja="${franja}">
                <div class="time-slot-hour">${franja}</div>
                <div id="reservas-${franja.replace(':','-')}" class="reservas-list"></div>
            </div>
        `;
    });
    contenedor.innerHTML = tarjetasHTML;
    console.log('Tarjetas de franjas creadas:', franjasHorarias);
}

//configuro todos los eventos
function configurarEventListeners(){
    console.log('Configurando los eventos');
    const toggleButton = document.querySelector('#toggleButton');
    toggleButton.addEventListener('click', toggleActivitiesList);

    registerButton.addEventListener('click', registerReservation);
    console.log('Evento Registrado correctamente');

    const tarjetas = document.querySelectorAll('.time-slot');

    //para detectar el click sobre una franja horaria y mostar el modal de esa franja horaria
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', function (event) {
            if(!event.target.closest('.reservation-item')){
                const franja = this.dataset.franja;
                abrirModal(franja);
            }
        });
    });

    const closeButton = document.querySelector('#closeButton');
    closeButton.addEventListener('click', closeModal());

    const modal = document.querySelector('#detailsModal');
    modal.addEventListener('click', function(event) {
        if(event.target===modal){
            closeModal();
        }
    });

    console.log('Todos los event listener configurados');
}

//mostrar ocultar lista de actividades
function toggleActivitiesList(){
    const columna = document.querySelector('#leftColumn');
    columna.classList.toggle('hidden');
}

//regitro una reserva
function registerReservation(){
    console.log('Registrando Nueva Reserva');

    const actIndex = document.querySelector('#activitySelect').value;
    const personas = parseInt(document.querySelector('#peopleSelect').value);
    const franja = document.querySelector('#timeSlotSelect').value;

    console.log('Valores seleccionados:', {actIndex, personas, franja});

    //obtengo la actividad del array
    const actividad = actividades[actIndex];
    console.log('Actividad seleccionada:', actividad);

    //creo el objeto de la nueva reserva que quiero registrar
    const reserva = {
        actividad: actividad.nombre,
        personas: personas,
        duracion: actividad.duracion,
        cargaTotal: actividad.duracion*personas, 
    };

    console.log('Objeto de la nueva reserva creado:', reserva);

    //agrego la reserva del array a la franja
    reservas[franja].push(reserva);
    console.log(`Reserva agregada al array de ${franja}:`, reservas[franja]);

    console.log('Llamando a actualizarVisualizacionFranja()');
    actualizarVisualizacionFranja(franja);

}

//actuallizar visualizacion de una franja
function actualizarVisualizacionFranja(franja){
    console.log(`Actualizando visualizacion de la franja ${franja}`);

    //busco la targeta que lo contendra
    const contenedor = document.querySelector(`#reservas-${franja.replace}(':','-')}`);
    console.log('Tarjeta contenedora encontrada:', contenedor);

    //si hay algun error en el replace o encontrando la tarjeta correcta 
    if(!contenedor){
        console.error(`ERROR: no se encontro el contenedor #reservas-${franja}`);
        return;
    }

    const reservasFranja =  reservas[franja];
    console.log(`Reservas en la franja ${franja}`, reservasFranja);

    //limpio
    contenedor.innerHTML='';
    console.log('Contenedor limpiado');

    //creo el HTML para cada reserva
    let reservasHTML='';
    reservasFranja.forEach((res,index) =>{
        console.log(`Procesando reserva ${index}:`, res);
        reservasHTML+=`
            <div class="reservation-item">${res.actividad}x${res.personas}persona${res.personas > 1 ? 's' : ''}</div>
        `;
    });
    console.log('HTML generado', reservasHTML);

    //inserto el HTML
    contenedor.innerHTML=reservasHTML;
    console.log('HTML insertado en el contemedor');
    console.log('HTML final del contenedor', contenedor.innerHTML);
}

//abrir el modal con los detalles de la hora
function abrirModal(franja){
    const reservasFranjas = reservas[franja];

    if(reservasFranjas.length === 0){
        alert('No hay reservas para esta franja horaria');
        return;
    }

    document.querySelector('#modalTitle').textContent=`Detalles de reservas para las ${franja}`;

    const tbody = document.querySelector('#modalTableBody');
    tbody.innerHTML='';

    let filasHTML='';
    let totalMinutos= 0;

    reservasFranjas.forEach(res => {
        filasHTML+=`
            <tr>
                <td>${res.actividad}</td>
                <td>${res.personas}</td>
                <td>${res.duracion}</td>
                <td>${res.cargaTotal}</td>
            </tr>
        `;

        totalMinutos += res.cargaTotal;

    });

    tbody.innerHTML=filasHTML;
    document.querySelector('#totalMinutes').textContent =  `${totalMinutos} min`;
    document.querySelector('#detailsModal').classList.add('show');
}

//para cerrar el modal
function closeModal(){
    const modal = document.querySelector('#detailsModal');
    modal.classList.remove('show');
}

//para inicializar la aplicacion
inicializarAplicacion();