
// Configuración rápida – cambiar teléfono y mensaje
const WHATSAPP_PHONE = '5492990000000'; // Reemplazar por teléfono real con código país
const DEFAULT_MSG = 'Hola! Quiero reservar una mesa para hoy.';

function waLink(msg=DEFAULT_MSG){
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}
document.addEventListener('DOMContentLoaded', ()=>{
  const buttons = document.querySelectorAll('[data-wa]');
  buttons.forEach(b=>{
    b.addEventListener('click', ()=>{
      window.open(waLink(b.dataset.msg || DEFAULT_MSG),'_blank');
    });
  });
});
