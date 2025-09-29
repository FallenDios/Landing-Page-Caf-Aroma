
/**
 * Cargador muy simple para inyectar contenido desde /content/site.json
 * Reemplaza textos con [data-bind="ruta.objeto"] y rellena listas con <template data-repeat="ruta.lista">
 * Ejemplos:
 *   <h1 data-bind="hero.title"></h1>
 *   <a data-bind="hero.cta_text" data-href="hero.cta_link"></a>
 *   <ul>
 *     <template data-repeat="menu.items">
 *        <li><span data-bind="name"></span> — <span data-bind="price"></span></li>
 *     </template>
 *   </ul>
 */
(function(){
  function get(obj, path){
    return path.split('.').reduce((o,k)=> (o ? o[k] : undefined), obj);
  }
  function formatPrice(v){
    if (typeof v === "number") { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v); }
    return v;
  }
  fetch('/content/site.json')
    .then(r=>r.json())
    .then(data => {
      // Text bindings
      document.querySelectorAll('[data-bind]').forEach(el => {
        const path = el.getAttribute('data-bind');
        let val = get(data, path);
        if (val === undefined) return;
        if (typeof val === 'number') val = formatPrice(val);
        el.textContent = val;
      });
      // Href/src bindings
      document.querySelectorAll('[data-href]').forEach(el => {
        const path = el.getAttribute('data-href');
        const val = get(data, path);
        if (val) el.setAttribute('href', val);
      });
      document.querySelectorAll('[data-src]').forEach(el => {
        const path = el.getAttribute('data-src');
        const val = get(data, path);
        if (val) el.setAttribute('src', val);
      });
      // Repeats
      document.querySelectorAll('template[data-repeat]').forEach(tpl => {
        const path = tpl.getAttribute('data-repeat');
        const list = get(data, path);
        if (!Array.isArray(list)) return;
        const parent = tpl.parentElement;
        list.forEach(item => {
          const node = tpl.content.cloneNode(true);
          // resolve child bindings relative to item
          node.querySelectorAll('[data-bind]').forEach(el => {
            const p = el.getAttribute('data-bind');
            let val = p.includes('.') ? get(item, p) : item[p];
            if (typeof val === 'number') val = formatPrice(val);
            if (val !== undefined) el.textContent = val;
          });
          parent.appendChild(node);
        });
        tpl.remove();
      });
    })
    .catch(err => {
      console.error('Error cargando contenido:', err);
    });
})();
