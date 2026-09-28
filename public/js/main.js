const signupForm = document.querySelector(".signup-form");
const formNote = document.querySelector("#form-note");

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Datos validados. No se han enviado ni almacenado.";
    formNote.classList.add("form-note-success");
});