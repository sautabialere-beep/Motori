# Regole del progetto "Motori"

Questo sito viene pubblicato con GitHub Pages. Chi lavora su questo repository
(persona o assistente AI) deve sempre rispettare queste regole.

## Cos'è questo sito
Un sito statico, senza server e senza passaggi di compilazione (build).

## Regole tecniche
- Solo HTML, CSS e JavaScript. Nessuna libreria esterna, nessun framework,
  nessun passaggio di build (niente npm, webpack, ecc.).
- `index.html` deve stare nella cartella principale del progetto.
- Tutti i percorsi (link, immagini, css, js) devono essere relativi, mai
  assoluti, così il sito funziona anche su GitHub Pages.
- I contenuti (testi, elenchi, informazioni) stanno in file di testo semplice
  dentro la cartella `contenuti/`, separati dal codice, così possono essere
  modificati anche da chi non sa programmare.

## Regole per i commit e il push
- Commit piccoli e frequenti.
- Messaggi di commit in italiano, chiari, che spiegano cosa è cambiato
  (es. "Aggiunta pagina motori diesel", non "update").
- Usare sempre e solo `git` da riga di comando. Non usare mai `gh` (GitHub CLI).
- Prima di ogni `git push` chiedere sempre conferma all'utente.

## Regole di comunicazione
- Spiegare sempre le operazioni tecniche con parole semplici, senza dare per
  scontato che chi legge sappia programmare.

## Privacy
- Il repository è pubblico: non inserire mai dati personali reali di
  studenti (nomi, foto, voti, classi, ecc.). Usare solo dati generici o
  di esempio.
