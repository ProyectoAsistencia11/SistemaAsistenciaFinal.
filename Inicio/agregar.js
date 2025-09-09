// Mostrar el formulario modal
function mostrarFormulario() {
  document.getElementById("modal").style.display = "flex";
}

// Cerrar el formulario y limpiar campos
function cerrarformulario() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("miFormulario").reset();
  document.getElementById("foto-preview-form").src = ""; // Limpia la vista previa
}

let ultimoAlumnoGuardado = null;

// Guardar alumno en el backend
function guardarAlumnos() {
  const nombre = document.getElementById('nombre').value.trim();
  const tutor = document.getElementById('nombretutor').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const aula = document.getElementById('aula').value;
  const fotoInput = document.getElementById('foto-input');
  const imagen = fotoInput.files[0];

  if (!nombre || !tutor || !telefono || !aula) {
    alert('Por favor completa todos los campos obligatorios');
    return;
  }

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('tutor', tutor);
  formData.append('telefono', telefono);
  formData.append('aula', aula);
  if (imagen) formData.append('imagen', imagen);

  fetch('http://localhost:3000/api/alumnos', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.mensaje === "Alumno guardado") {
      alert('Alumno guardado correctamente.');
      ultimoAlumnoGuardado = {
        id: data.id,
        nombre,
        tutor,
        telefono,
        aula,
        imagen: data.imagen,
        qr: data.qr
      };
    } else {
      console.error("Respuesta inesperada:", data);
      alert('Error al guardar el alumno: ' + (data.error || 'Respuesta inesperada del servidor'));
    }
  })
  .catch(error => {
    console.error("Error de conexión:", error);
    alert('Error en la conexión al servidor: ' + error.message);
  });
}

// Vista previa de la foto
function cargarFoto(event) {
  const archivo = event.target.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = function(e) {
      document.getElementById("foto-preview-form").src = e.target.result;
    };
    lector.readAsDataURL(archivo);
  }
}

// Mostrar ficha del último alumno guardado
function verFichaActual() {
  if (!ultimoAlumnoGuardado || !ultimoAlumnoGuardado.id) {
    alert('No hay alumno guardado para mostrar.');
    return;
  }

  const nombreEl = document.getElementById('ficha-nombre');
  const tutorEl = document.getElementById('ficha-tutor');
  const telefonoEl = document.getElementById('ficha-telefono');
  const aulaEl = document.getElementById('aula-alumno');
  const imagenEl = document.getElementById('ficha-imagen');
  const qrEl = document.getElementById('ficha-qr');

  if (nombreEl) nombreEl.textContent = ultimoAlumnoGuardado.nombre;
  if (tutorEl) tutorEl.textContent = ultimoAlumnoGuardado.tutor;
  if (telefonoEl) telefonoEl.textContent = ultimoAlumnoGuardado.telefono;
  if (aulaEl) aulaEl.textContent = ultimoAlumnoGuardado.aula;
  if (imagenEl) imagenEl.src = `http://localhost:3000/uploads/${ultimoAlumnoGuardado.imagen}`;
  if (qrEl) qrEl.src = `http://localhost:3000/qr/${ultimoAlumnoGuardado.qr}`;

  const fichaModelo = document.getElementById('ficha-modelo');
  if (fichaModelo) fichaModelo.style.display = 'block';
}

function cerrarFicha() {
  const fichaModelo = document.getElementById('ficha-modelo');
  if (fichaModelo) fichaModelo.style.display = 'none';
}

function imprimirFicha(){
  window.print();
}