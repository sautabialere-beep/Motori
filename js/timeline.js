// Linea del tempo interattiva sulla storia dei motori.
// Legge gli eventi da contenuti/eventi.txt: chi vuole cambiare i contenuti
// deve modificare solo quel file di testo, non questo codice.

(function () {
  'use strict';

  var CATEGORIE = {
    vapore: { etichetta: 'Vapore' },
    scoppio: { etichetta: 'Scoppio (benzina)' },
    diesel: { etichetta: 'Diesel' },
    elettrico: { etichetta: 'Elettrico' },
    moderno: { etichetta: 'Ibrido / moderno' }
  };

  var SCHEMI = {
    vapore: { file: 'img/schema-vapore.svg', titolo: 'Motore a vapore' },
    scoppio: { file: 'img/schema-scoppio.svg', titolo: 'Motore a scoppio (4 tempi)' },
    diesel: { file: 'img/schema-diesel.svg', titolo: 'Motore Diesel' },
    elettrico: { file: 'img/schema-elettrico.svg', titolo: 'Motore elettrico' }
  };

  // Ritratti storici (o fotografie d'epoca) collegati a un evento tramite
  // l'anno, che nella nostra lista è sempre un numero unico. Le immagini
  // vengono da Wikimedia Commons, sono di pubblico dominio: vedi CREDITI.md.
  var IMMAGINI_EVENTI = {
    1769: { file: 'img/inventori/watt.jpg', alt: 'Ritratto di James Watt' },
    1807: { file: 'img/inventori/de-rivaz.jpg', alt: 'Ritratto di François Isaac de Rivaz' },
    1821: { file: 'img/inventori/faraday.jpg', alt: 'Ritratto di Michael Faraday' },
    1828: { file: 'img/inventori/jedlik.jpg', alt: 'Ritratto di Ányos Jedlik' },
    1834: { file: 'img/inventori/davenport.jpg', alt: 'Ritratto di Thomas Davenport' },
    1860: { file: 'img/inventori/lenoir.jpg', alt: 'Ritratto di Étienne Lenoir' },
    1862: { file: 'img/inventori/beau-de-rochas.jpg', alt: 'Ritratto di Alphonse Beau de Rochas' },
    1876: { file: 'img/inventori/otto.jpg', alt: 'Ritratto di Nicolaus Otto' },
    1884: { file: 'img/inventori/parsons.jpg', alt: 'Ritratto di Charles Algernon Parsons' },
    1885: { file: 'img/inventori/daimler.jpg', alt: 'Ritratto di Gottlieb Daimler' },
    1886: { file: 'img/inventori/benz.jpg', alt: 'Ritratto di Karl Benz' },
    1888: { file: 'img/inventori/flocken.jpg', alt: 'Ritratto di Andreas Flocken' },
    1892: { file: 'img/inventori/diesel.jpg', alt: 'Ritratto di Rudolf Diesel' },
    1897: { file: 'img/inventori/diesel.jpg', alt: 'Ritratto di Rudolf Diesel' },
    1899: { file: 'img/inventori/jenatzy.jpg', alt: 'Camille Jenatzy a bordo de "La Jamais Contente"' },
    1908: { file: 'img/inventori/ford.jpg', alt: 'Ritratto di Henry Ford' },
    1913: { file: 'img/inventori/ford.jpg', alt: 'Ritratto di Henry Ford' },
    1957: { file: 'img/inventori/wankel.jpg', alt: 'Ritratto di Felix Wankel' }
  };

  // Luogo approssimativo di ogni evento (per il planisfero), in latitudine
  // e longitudine. Coordinate indicative del luogo storico, non un punto
  // esatto su una mappa catastale.
  var LUOGHI_EVENTI = {
    1712: { luogo: 'Dartmouth, Inghilterra', lat: 50.35, lon: -3.58 },
    1769: { luogo: 'Glasgow, Scozia', lat: 55.86, lon: -4.25 },
    1807: { luogo: 'Sion, Svizzera', lat: 46.23, lon: 7.36 },
    1821: { luogo: 'Londra, Inghilterra', lat: 51.51, lon: -0.13 },
    1828: { luogo: 'Pozsony (oggi Bratislava)', lat: 48.15, lon: 17.11 },
    1834: { luogo: 'Vermont, Stati Uniti', lat: 43.6, lon: -72.6 },
    1860: { luogo: 'Parigi, Francia', lat: 48.85, lon: 2.35 },
    1862: { luogo: 'Digne, Francia', lat: 44.09, lon: 6.24 },
    1876: { luogo: 'Deutz (Colonia), Germania', lat: 50.93, lon: 6.97 },
    1884: { luogo: 'Newcastle upon Tyne, Inghilterra', lat: 54.97, lon: -1.61 },
    1885: { luogo: 'Bad Cannstatt (Stoccarda), Germania', lat: 48.81, lon: 9.21 },
    1886: { luogo: 'Mannheim, Germania', lat: 49.49, lon: 8.47 },
    1888: { luogo: 'Coburgo, Germania', lat: 50.26, lon: 10.96 },
    1892: { luogo: 'Germania', lat: 48.37, lon: 10.90 },
    1897: { luogo: 'Augusta, Germania', lat: 48.37, lon: 10.90 },
    1899: { luogo: 'Achères, vicino Parigi, Francia', lat: 48.97, lon: 2.15 },
    1900: { luogo: 'Stati Uniti', lat: 40.71, lon: -74.01 },
    1908: { luogo: 'Detroit, Michigan, Stati Uniti', lat: 42.33, lon: -83.05 },
    1912: { luogo: 'Copenaghen, Danimarca', lat: 55.68, lon: 12.57 },
    1913: { luogo: 'Highland Park, Michigan, Stati Uniti', lat: 42.40, lon: -83.10 },
    1936: { luogo: 'Stoccarda, Germania', lat: 48.78, lon: 9.18 },
    1957: { luogo: 'Neckarsulm, Germania', lat: 49.19, lon: 9.23 },
    1997: { luogo: 'Toyota City, Giappone', lat: 35.08, lon: 137.16 },
    2008: { luogo: 'California, Stati Uniti', lat: 37.51, lon: -122.26 },
    2010: { luogo: 'Yokohama, Giappone', lat: 35.44, lon: 139.64 }
  };

  var NUMERO_EVENTI_QUIZ = 8;

  var eventi = [];
  var categorieAttive = {};
  Object.keys(CATEGORIE).forEach(function (c) { categorieAttive[c] = true; });
  var pxPerAnno = 6;

  // --- Caricamento e lettura del file di testo -----------------------

  fetch('contenuti/eventi.txt')
    .then(function (risposta) { return risposta.text(); })
    .then(function (testo) {
      eventi = interpretaEventi(testo);
      if (eventi.length === 0) {
        mostraErroreCaricamento();
        return;
      }
      creaFiltri();
      creaGrigliaSchemi();
      disegnaLineaDelTempo();
      creaMappa();
      inizializzaQuiz();
    })
    .catch(function () {
      mostraErroreCaricamento();
    });

  function mostraErroreCaricamento() {
    var track = document.getElementById('timelineTrack');
    track.innerHTML = '<p style="padding:1rem;">Non riesco a caricare gli eventi da contenuti/eventi.txt. ' +
      'Se hai aperto il file direttamente dal computer, prova a vederlo tramite GitHub Pages o un piccolo server locale.</p>';
  }

  function interpretaEventi(testo) {
    var righe = testo.split(/\r?\n/);
    var risultato = [];
    var id = 0;

    righe.forEach(function (rigaOriginale) {
      var riga = rigaOriginale.trim();
      if (riga.length === 0 || riga.indexOf('#') === 0) {
        return;
      }
      var campi = riga.split('|').map(function (c) { return c.trim(); });
      if (campi.length !== 4) {
        console.warn('Riga di eventi.txt ignorata (servono 4 campi separati da |):', rigaOriginale);
        return;
      }
      var anno = parseInt(campi[0], 10);
      var titolo = campi[1];
      var descrizione = campi[2];
      var categoria = campi[3];

      if (isNaN(anno)) {
        console.warn('Riga di eventi.txt ignorata (anno non valido):', rigaOriginale);
        return;
      }
      if (!CATEGORIE[categoria]) {
        console.warn('Riga di eventi.txt ignorata (categoria sconosciuta "' + categoria + '"):', rigaOriginale);
        return;
      }
      if (!titolo || !descrizione) {
        console.warn('Riga di eventi.txt ignorata (titolo o descrizione mancanti):', rigaOriginale);
        return;
      }

      risultato.push({
        id: 'evt-' + (id++),
        anno: anno,
        titolo: titolo,
        descrizione: descrizione,
        categoria: categoria
      });
    });

    risultato.sort(function (a, b) { return a.anno - b.anno; });
    return risultato;
  }

  // --- Filtri per categoria -------------------------------------------

  function creaFiltri() {
    var contenitore = document.getElementById('filtriCategorie');
    contenitore.innerHTML = '';

    Object.keys(CATEGORIE).forEach(function (chiave) {
      var bottone = document.createElement('button');
      bottone.type = 'button';
      bottone.className = 'filtro-categoria cat-' + chiave;
      bottone.textContent = CATEGORIE[chiave].etichetta;
      bottone.setAttribute('aria-pressed', 'true');
      bottone.addEventListener('click', function () {
        categorieAttive[chiave] = !categorieAttive[chiave];
        bottone.setAttribute('aria-pressed', String(categorieAttive[chiave]));
        applicaFiltri();
      });
      contenitore.appendChild(bottone);
    });
  }

  function applicaFiltri() {
    var nodi = document.querySelectorAll('#timelineTrack [data-categoria], #mappaMarcatori [data-categoria]');
    nodi.forEach(function (nodo) {
      var visibile = categorieAttive[nodo.getAttribute('data-categoria')];
      nodo.classList.toggle('nascosto', !visibile);
    });
  }

  // --- Disegno della linea del tempo -----------------------------------

  function disegnaLineaDelTempo() {
    var track = document.getElementById('timelineTrack');

    // Rimuove eventi disegnati in precedenza, lascia la linea centrale.
    track.querySelectorAll('.pallino-evento, .scheda-mini').forEach(function (n) { n.remove(); });

    var primoAnno = eventi[0].anno;
    var ultimoAnno = eventi[eventi.length - 1].anno;
    var margine = 100;
    var larghezza = (ultimoAnno - primoAnno) * pxPerAnno + margine * 2;
    track.style.width = larghezza + 'px';

    eventi.forEach(function (evento, indice) {
      var x = margine + (evento.anno - primoAnno) * pxPerAnno;
      var sopra = indice % 2 === 0;

      var pallino = document.createElement('div');
      pallino.className = 'pallino-evento cat-' + evento.categoria;
      pallino.style.left = x + 'px';
      pallino.setAttribute('data-categoria', evento.categoria);
      track.appendChild(pallino);

      var scheda = document.createElement('button');
      scheda.type = 'button';
      scheda.className = 'scheda-mini cat-' + evento.categoria + (sopra ? ' sopra' : ' sotto');
      scheda.style.left = x + 'px';
      scheda.setAttribute('data-categoria', evento.categoria);
      scheda.innerHTML =
        '<span class="mini-anno">' + evento.anno + '</span>' +
        '<span class="mini-titolo">' + escapeHtml(evento.titolo) + '</span>';
      scheda.addEventListener('click', function () { apriScheda(evento); });
      track.appendChild(scheda);
    });

    applicaFiltri();
  }

  document.getElementById('zoomRange').addEventListener('input', function (e) {
    pxPerAnno = parseInt(e.target.value, 10);
    var scrollContenitore = document.getElementById('timelineScroll');
    var posizioneRelativa = scrollContenitore.scrollLeft / (scrollContenitore.scrollWidth || 1);
    disegnaLineaDelTempo();
    scrollContenitore.scrollLeft = posizioneRelativa * scrollContenitore.scrollWidth;
  });

  // --- Scheda di dettaglio ----------------------------------------------

  function apriScheda(evento) {
    var overlay = document.getElementById('overlayScheda');
    var badge = document.getElementById('schedaBadge');
    var immagine = document.getElementById('schedaImmagine');
    var blocchettoSchema = document.getElementById('blocchettoSchema');
    var immagineStorica = document.getElementById('schedaImmagineStorica');
    var luogoTesto = document.getElementById('schedaLuogo');
    var schema = SCHEMI[evento.categoria];
    var ritratto = IMMAGINI_EVENTI[evento.anno];
    var luogo = LUOGHI_EVENTI[evento.anno];

    badge.textContent = CATEGORIE[evento.categoria].etichetta;
    badge.className = 'badge-categoria cat-' + evento.categoria;
    document.getElementById('schedaTitolo').textContent = evento.titolo;
    document.getElementById('schedaAnno').textContent = 'Anno: ' + evento.anno;
    document.getElementById('schedaDescrizione').textContent = evento.descrizione;

    if (luogo) {
      luogoTesto.textContent = 'Luogo: ' + luogo.luogo;
      luogoTesto.classList.remove('nascosto');
    } else {
      luogoTesto.textContent = '';
      luogoTesto.classList.add('nascosto');
    }

    if (ritratto) {
      immagineStorica.src = ritratto.file;
      immagineStorica.alt = ritratto.alt;
      immagineStorica.classList.remove('nascosto');
    } else {
      immagineStorica.removeAttribute('src');
      immagineStorica.classList.add('nascosto');
    }

    if (schema) {
      immagine.src = schema.file;
      immagine.alt = 'Schema di funzionamento: ' + schema.titolo;
      blocchettoSchema.classList.remove('nascosto');
    } else {
      immagine.removeAttribute('src');
      blocchettoSchema.classList.add('nascosto');
    }

    document.querySelector('.scheda-dettaglio').className = 'scheda-dettaglio cat-' + evento.categoria;
    overlay.classList.remove('nascosto');
    document.getElementById('chiudiScheda').focus();
  }

  function chiudiScheda() {
    document.getElementById('overlayScheda').classList.add('nascosto');
  }

  document.getElementById('chiudiScheda').addEventListener('click', chiudiScheda);
  document.getElementById('overlayScheda').addEventListener('click', function (e) {
    if (e.target.id === 'overlayScheda') { chiudiScheda(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { chiudiScheda(); }
  });

  // --- Griglia degli schemi di funzionamento ----------------------------

  function creaGrigliaSchemi() {
    var griglia = document.getElementById('grigliaSchemi');
    griglia.innerHTML = '';
    Object.keys(SCHEMI).forEach(function (chiave) {
      var schema = SCHEMI[chiave];
      var scheda = document.createElement('div');
      scheda.className = 'scheda-schema cat-' + chiave;
      scheda.innerHTML =
        '<img src="' + schema.file + '" alt="Schema di funzionamento: ' + schema.titolo + '">' +
        '<h3>' + schema.titolo + '</h3>';
      griglia.appendChild(scheda);
    });
  }

  // --- Planisfero -----------------------------------------------------

  function creaMappa() {
    var contenitore = document.getElementById('mappaMarcatori');
    contenitore.innerHTML = '';

    // Raggruppa gli eventi che condividono (circa) lo stesso luogo, così sul
    // planisfero appare un solo pallino invece di più pallini sovrapposti.
    var gruppi = {};
    eventi.forEach(function (evento) {
      var luogo = LUOGHI_EVENTI[evento.anno];
      if (!luogo) { return; }
      var chiave = luogo.lat.toFixed(1) + ',' + luogo.lon.toFixed(1);
      if (!gruppi[chiave]) {
        gruppi[chiave] = { luogo: luogo, eventi: [] };
      }
      gruppi[chiave].eventi.push(evento);
    });

    Object.keys(gruppi).forEach(function (chiave) {
      var gruppo = gruppi[chiave];
      var xPercento = (gruppo.luogo.lon + 180) / 360 * 100;
      var yPercento = (90 - gruppo.luogo.lat) / 180 * 100;
      var primoEvento = gruppo.eventi[0];

      var marcatore = document.createElement('button');
      marcatore.type = 'button';
      marcatore.className = 'marcatore-mappa cat-' + primoEvento.categoria;
      marcatore.style.left = xPercento + '%';
      marcatore.style.top = yPercento + '%';
      marcatore.setAttribute('data-categoria', primoEvento.categoria);

      var etichetta = gruppo.luogo.luogo + ': ' + gruppo.eventi.map(function (e) { return e.anno + ' - ' + e.titolo; }).join(' · ');
      marcatore.setAttribute('aria-label', etichetta);
      marcatore.title = etichetta;

      marcatore.addEventListener('click', function () {
        apriScheda(primoEvento);
      });

      contenitore.appendChild(marcatore);
    });
  }

  function escapeHtml(testo) {
    var d = document.createElement('div');
    d.textContent = testo;
    return d.innerHTML;
  }

  // --- Modalità quiz ------------------------------------------------------

  var bottoneQuiz = document.getElementById('bottoneQuiz');
  var bottoneTorna = document.getElementById('bottoneTornaTimeline');
  var bottoneNuovaSerie = document.getElementById('bottoneNuovaSerie');
  var bottoneVerifica = document.getElementById('bottoneVerifica');
  var vistaTimeline = document.getElementById('vista-timeline');
  var vistaQuiz = document.getElementById('vista-quiz');
  var quizPool = document.getElementById('quizPool');
  var quizSlot = document.getElementById('quizSlot');
  var quizRisultato = document.getElementById('quizRisultato');

  var eventiQuizCorrenti = [];

  function inizializzaQuiz() {
    bottoneQuiz.addEventListener('click', function () {
      vistaTimeline.classList.add('nascosto');
      vistaQuiz.classList.remove('nascosto');
      nuovaSerieQuiz();
    });
    bottoneTorna.addEventListener('click', function () {
      vistaQuiz.classList.add('nascosto');
      vistaTimeline.classList.remove('nascosto');
    });
    bottoneNuovaSerie.addEventListener('click', nuovaSerieQuiz);
    bottoneVerifica.addEventListener('click', verificaQuiz);
  }

  function nuovaSerieQuiz() {
    quizRisultato.textContent = '';
    var copia = eventi.slice();
    mescola(copia);
    eventiQuizCorrenti = copia.slice(0, Math.min(NUMERO_EVENTI_QUIZ, copia.length));

    // Le caselle rappresentano l'ordine cronologico corretto.
    quizSlot.innerHTML = '';
    eventiQuizCorrenti.forEach(function (evento, indice) {
      var casella = document.createElement('div');
      casella.className = 'casella-slot';
      casella.setAttribute('data-numero', String(indice + 1) + (indice === 0 ? ' (più antico)' : (indice === eventiQuizCorrenti.length - 1 ? ' (più recente)' : '')));
      casella.setAttribute('data-posizione', String(indice));
      abilitaCasellaComeDestinazione(casella);
      quizSlot.appendChild(casella);
    });

    // Il gruppo di partenza mostra le carte in ordine mescolato, senza anno.
    var mescolate = eventiQuizCorrenti.slice();
    mescola(mescolate);
    quizPool.innerHTML = '';
    abilitaCasellaComeDestinazione(quizPool);
    mescolate.forEach(function (evento) {
      quizPool.appendChild(creaCartaEvento(evento));
    });
  }

  function creaCartaEvento(evento) {
    var carta = document.createElement('div');
    carta.className = 'carta-evento cat-' + evento.categoria;
    carta.textContent = evento.titolo;
    carta.setAttribute('draggable', 'true');
    carta.setAttribute('data-id', evento.id);
    carta.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', evento.id);
      e.dataTransfer.effectAllowed = 'move';
    });
    return carta;
  }

  function abilitaCasellaComeDestinazione(elemento) {
    elemento.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      elemento.classList.add('sopra-target');
    });
    elemento.addEventListener('dragleave', function () {
      elemento.classList.remove('sopra-target');
    });
    elemento.addEventListener('drop', function (e) {
      e.preventDefault();
      elemento.classList.remove('sopra-target');
      var id = e.dataTransfer.getData('text/plain');
      var carta = document.querySelector('.carta-evento[data-id="' + id + '"]');
      if (!carta) { return; }

      // Se la casella di destinazione (una singola posizione) contiene già
      // una carta, quella carta torna nel gruppo di partenza.
      if (elemento.classList.contains('casella-slot')) {
        var cartaEsistente = elemento.querySelector('.carta-evento');
        if (cartaEsistente && cartaEsistente !== carta) {
          quizPool.appendChild(cartaEsistente);
        }
      }
      carta.classList.remove('corretta', 'sbagliata');
      elemento.appendChild(carta);
    });
  }

  function verificaQuiz() {
    var caselle = quizSlot.querySelectorAll('.casella-slot');
    var corrette = 0;
    var totaleRiempite = 0;

    caselle.forEach(function (casella, posizione) {
      var carta = casella.querySelector('.carta-evento');
      carta && carta.classList.remove('corretta', 'sbagliata');
      if (!carta) { return; }
      totaleRiempite++;
      var idAtteso = eventiQuizCorrenti[posizione].id;
      if (carta.getAttribute('data-id') === idAtteso) {
        carta.classList.add('corretta');
        corrette++;
      } else {
        carta.classList.add('sbagliata');
      }
    });

    if (totaleRiempite < eventiQuizCorrenti.length) {
      quizRisultato.textContent = 'Metti tutte le schede nelle caselle prima di verificare (mancano ' +
        (eventiQuizCorrenti.length - totaleRiempite) + ').';
      return;
    }

    quizRisultato.textContent = 'Hai messo al posto giusto ' + corrette + ' eventi su ' +
      eventiQuizCorrenti.length + '. Le caselle verdi sono corrette, quelle rosse no.';
  }

  function mescola(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

})();
