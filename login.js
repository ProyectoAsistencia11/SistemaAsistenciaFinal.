const clave = document.getElementById("clave");
const mensaje = document.getElementById("mensaje-error");
const btnAcceder = document.getElementById("btnAcceder");

function mostrarError(texto, clase) {
  mensaje.textContent = texto;
  mensaje.classList.add("visible");
  clave.classList.add(clase);
}

function validar() {
  const valor = clave.value.trim();
  console.log("valor:", valor);

  clave.classList.remove("error", "temblar");
  mensaje.textContent = "";
  mensaje.classList.remove("visible");

  if (valor === "") {
    mostrarError("Campo obligatorio", "temblar");
    return;
  }

  fetch("http://localhost:3000/validar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clave: valor })
  })
  .then(res => res.text())
  .then(respuesta => {
if (respuesta === "ok") {
  const carga = document.getElementById("pantalla-carga");
  carga.classList.add("visible");

  // Esperá un frame para que el navegador aplique el estilo
  requestAnimationFrame(() => {
    setTimeout(() => {
      location.href = "./Inicio/Inicio.html";
    }, 2000);
  });
}
 else {
      mostrarError("Contraseña incorrecta", "error");
    }
  })
  .catch(() => {
    mostrarError("Error de conexión con el servidor", "error");
  });
}

btnAcceder.addEventListener("click", validar);
clave.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    btnAcceder.click();
  }
});
