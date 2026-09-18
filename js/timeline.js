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
    var nodi = document.querySelectorAll('#timelineTrack [data-categoria]');
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
    var schema = SCHEMI[evento.categoria];

    badge.textContent = CATEGORIE[evento.categoria].etichetta;
    badge.className = 'badge-categoria cat-' + evento.categoria;
    document.getElementById('schedaTitolo').textContent = evento.titolo;
    document.getElementById('schedaAnno').textContent = 'Anno: ' + evento.anno;
    document.getElementById('schedaDescrizione').textContent = evento.descrizione;

    if (schema) {
      immagine.src = schema.file;
      immagine.alt = 'Schema di funzionamento: ' + schema.titolo;
      immagine.classList.remove('nascosto');
    } else {
      immagine.removeAttribute('src');
      immagine.classList.add('nascosto');
    }

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
