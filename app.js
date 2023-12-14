let intentos = 6;

let palabrasAleatorias = [
  "lunar",
  "flora",
  "pinza",
  "danza",
  "hojas",
  "papel",
  "venir",
  "fuego",
  "rosas",
  "campo",
  "sonar",
  "silla",
  "fruta",
  "brazo",
  "nubes",
  "mesas",
  "meson",
  "lunar",
  "canto",
  "grano",
];

let intento = 0;
let palabraEscrita = "";
let posLetraActual = 0;

let iniciado = false;
let finalizado = false;

const teclas = document.querySelectorAll(".tecla");
const filas = document.querySelectorAll(".boardFila");
const botonReiniciar = document.getElementById("reiniciar");
const divAviso = document.querySelector(".aviso");
divAviso.style.display = "none";
botonReiniciar.addEventListener("click", empezarJuego);

function seleccionarPalabraAleatoria(palabras) {
  const indiceAleatorio = Math.floor(Math.random() * palabras.length);
  return palabras[indiceAleatorio];
}

function mostrarAviso(aviso) {
  divAviso.textContent = aviso;
  divAviso.style.display = "flex";
  setTimeout(() => {
    divAviso.style.display = "none";
  }, 1000);
}
function mostrarAvisoLargo(aviso) {
  divAviso.textContent = aviso;
  divAviso.style.display = "flex";
}
function quitarAviso() {
  divAviso.style.display = "none";
}
function empezarJuego() {
  quitarAviso();
  intentos = 6;
  palabraObjetivo =
    seleccionarPalabraAleatoria(palabrasAleatorias).toUpperCase();
  intento = 0;
  palabraEscrita = "";
  posLetraActual = 0;
  finalizado = false;

  //si el juego se reinicio (no se termino), mostrar modal
  if (iniciado === true) {
    mostrarModal("reinicio");
  }
  iniciado = true;
  const letras = document.querySelectorAll(".letra");
  //quitar el color a las letras
  letras.forEach((letra) => {
    letra.textContent = "";
    letra.classList.remove("letraCorrecta");
    letra.classList.remove("letraPosicionCorrecta");
    letra.classList.remove("letraIncorrecta");
  });
  let teclasTeclado = Array.from(teclas);
  //quitar el color a las teclas
  teclasTeclado.forEach((t) => {
    t.classList.remove("teclaPresionada");
  });

  document.addEventListener("keydown", teclaHandler);
  teclas.forEach((tecla) => tecla.addEventListener("click", clickEnTecla));
}

function teclaHandler(event) {
  if (event.keyCode === 13) {
    clickEnTecla("Enter");
  } else if (event.key === "Backspace") {
    clickEnTecla("Borrar");
  } else {
    clickEnTecla(event.key);
  }
}
function clickEnTecla(presionado) {
  //escribirLetra(letra);
  //Si presiono enter, chequear palabra escrita si es que esta completa
  let letra = presionado;
  if (letra.srcElement) {
    letra = presionado.srcElement.textContent; //por si toca los botones
  }
  if (letra === "Enter") {
    if (posLetraActual == 5) {
      chequearPalabraEscrita();
      intento++;
      posLetraActual = 0;
    } else {
      console.log("Todavia no completaste la palabra");
    }
    //Si es backspace, borrar la letra
  } else if (letra == "Borrar") {
    if (posLetraActual !== 0) {
      let letrasEnFila = filas[intento].children;
      letrasEnFila[posLetraActual - 1].textContent = "";

      posLetraActual -= 1;
    } else {
      mostrarAviso("No hay nada que borrar");
    }
  }
  //Si no es enter, escribir letra
  else {
    if (!(posLetraActual === 5)) {
      const letraPresionada = letra.toUpperCase();
      teclas.forEach((tecla) => {
        if (tecla.textContent.toUpperCase() === letraPresionada) {
          escribirLetra(letraPresionada);
        }
      });
    } else {
      mostrarAviso("La palabra esta llena");
    }
  }
}
function escribirLetra(letra) {
  console.log(letra);
  let letrasEnFila = filas[intento].children;
  letrasEnFila[posLetraActual].textContent = letra;
  posLetraActual++;
}

function chequearPalabraEscrita() {
  let palabraEscrita = "";
  let letrasEnFila = Array.from(filas[intento].children);

  letrasEnFila.forEach((l) => {
    palabraEscrita += l.textContent;
  });
  console.log("Intento: " + palabraEscrita);
  for (let i = 0; i < palabraEscrita.length; i++) {
    let letraEscrita = palabraEscrita[i];
    let letraObjetivo = palabraObjetivo[i];

    if (letraEscrita === letraObjetivo) {
      letrasEnFila[i].classList.add("letraPosicionCorrecta");
    } else if (palabraObjetivo.includes(letraEscrita)) {
      letrasEnFila[i].classList.add("letraCorrecta");
    } else {
      letrasEnFila[i].classList.add("letraIncorrecta");
    }
  }

  let teclasTeclado = Array.from(teclas);
  teclasTeclado.forEach((t) => {
    if (palabraEscrita.includes(t.textContent.toUpperCase())) {
      t.classList.add("teclaPresionada");
      console.log(t);
    }
  });

  if (intento == intentos - 1 || palabraEscrita == palabraObjetivo) {
    terminarJuego(palabraEscrita);
  }
}

async function terminarJuego(palabraEscrita) {
  console.log("Juego terminado");
  finalizado = true;
  iniciado = false;

  desactivarEventListeners();
  mostrarAvisoLargo(palabraObjetivo);
  setTimeout(() => {
    if (palabraEscrita == palabraObjetivo) {
      console.log("Felicidades!");
      mostrarModal("ganar");
    } else {
      mostrarModal("perder");
    }
  }, 800);
}

function mostrarModal(suceso) {
  let modal = document.querySelector("#modal");
  let contenidoModal = document.querySelector(".modal-content");
  let tituloModal = document.querySelector("#tituloModal");
  let palabraCorrecta = document.querySelector("#palabraCorrecta");
  let botonAceptar = document.querySelector("#aceptarModal");

  if (suceso === "ganar") {
    tituloModal.textContent = "Has Ganado!";
    palabraCorrecta.textContent = palabraObjetivo;
    modal.style.display = "flex";
    contenidoModal.style.display = "flex";
  } else if (suceso === "perder") {
    tituloModal.textContent = "Has Perdido!";
    palabraCorrecta.textContent = palabraObjetivo;
    modal.style.display = "flex";
    contenidoModal.style.display = "flex";
  } else if (suceso === "reinicio") {
    tituloModal.textContent = "Reiniciar juego";
    palabraCorrecta.textContent = palabraObjetivo;
    modal.style.display = "flex";
    contenidoModal.style.display = "flex";
  }

  botonAceptar.addEventListener("click", ocultarModales);
}
function ocultarModales() {
  let modal = document.querySelector("#modal");
  modal.style.display = "none";
}

function desactivarEventListeners() {
  document.removeEventListener("keydown", teclaHandler);
  teclas.forEach((tecla) => tecla.removeEventListener("click", clickEnTecla));
}

empezarJuego();
