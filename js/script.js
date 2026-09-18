// Carica il testo da contenuti/home.txt e lo mostra nella pagina.
// Ogni riga vuota diventa un nuovo paragrafo.

fetch('contenuti/home.txt')
  .then(function (risposta) {
    return risposta.text();
  })
  .then(function (testo) {
    var contenitore = document.getElementById('contenuto-principale');
    contenitore.innerHTML = '';

    var paragrafi = testo.split(/\n\s*\n/);
    paragrafi.forEach(function (paragrafo) {
      var testoPulito = paragrafo.trim();
      if (testoPulito.length > 0) {
        var p = document.createElement('p');
        p.textContent = testoPulito;
        contenitore.appendChild(p);
      }
    });
  })
  .catch(function () {
    var contenitore = document.getElementById('contenuto-principale');
    contenitore.innerHTML = '<p>Non riesco a caricare il contenuto. Se stai aprendo il file direttamente dal computer, prova invece a caricarlo tramite GitHub Pages o un piccolo server locale.</p>';
  });
