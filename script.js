// ---------- ELEMENTOS ----------
const welcome = document.getElementById('welcome');
const enterBtn = document.getElementById('enterBtn');
const mainView = document.getElementById('mainView');
const bgMusic = document.getElementById('bgMusic');

const rsvpBtn = document.getElementById('rsvpBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const nameInput = document.getElementById('nameInput');
const guestsWrap = document.getElementById('guestsWrap');
const guestsInput = document.getElementById('guestsInput');
const sendBtn = document.getElementById('sendBtn');
const radios = document.getElementsByName('attend');

// Asegurar que el modal esté oculto al inicio
modal.classList.add('hidden');

// ---------- BIENVENIDA / MÚSICA ----------
enterBtn.addEventListener('click', () => {
  bgMusic.volume = 0.5;
  bgMusic.play().catch(()=>{ /* autoplay puede bloquearse; se ignora */ });
  welcome.style.opacity = '0';
  setTimeout(()=> {
    welcome.classList.add('hidden');
    mainView.classList.remove('hidden');
  }, 600);
});

// ---------- CUENTA REGRESIVA ----------
const eventDate = new Date('2026-09-12T20:00:00').getTime(); // ajusta la fecha
function updateCountdown(){
  const now = Date.now();
  const diff = eventDate - now;
  if(diff <= 0){
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);
  document.getElementById('days').textContent = String(days).padStart(2,'0');
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- MODAL / FORM ----------
// Abrir modal SOLO al hacer clic en el botón Confirmar
rsvpBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  setTimeout(()=> nameInput.focus(), 100);
});

// Cerrar modal
closeModal.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', e => { if(e.target === modal) modal.classList.add('hidden'); });

// Mostrar campo de personas solo si responde "sí"
Array.from(radios).forEach(r => {
  r.addEventListener('change', () => {
    if(r.value === 'si' && r.checked) guestsWrap.classList.remove('hidden');
    if(r.value === 'no' && r.checked) guestsWrap.classList.add('hidden');
  });
});

// ---------- ENVÍO EmailJS ----------
sendBtn.addEventListener('click', async () => {
  const nombre = nameInput.value.trim();
  const seleccion = document.querySelector('input[name="attend"]:checked');
  const personas = guestsInput.value;

  if(!nombre){ alert('Escribe tu nombre'); return; }
  if(!seleccion){ alert('Selecciona si asistirás o no'); return; }
  if(seleccion.value === 'si' && (!personas || Number(personas) <= 0)){ alert('Ingresa el número de personas'); return; }

  // Reemplaza serviceID y templateID por los tuyos
  const serviceID = 'service_09osev8';
  const templateID = 'template_nlegmfk';

  try{
    await emailjs.send(serviceID, templateID, {
      nombre: nombre,
      asistencia: seleccion.value,
      personas: seleccion.value === 'si' ? personas : 0
    });
    modal.classList.add('hidden');
    rsvpBtn.disabled = true;
    rsvpBtn.textContent = '✔ Asistencia confirmada';
    alert('¡Gracias! Tu respuesta fue enviada.');
  }catch(err){
    console.error(err);
    alert('No se pudo enviar la confirmación. Revisa tu conexión o IDs de EmailJS.');
  }
});
