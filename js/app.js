$(this.game).ready(function () {
  /**
   * Je crée mes armes et je les stockes dans un tabeau.
   */
  let tableauArmes = [];
  const kopis = new Arme("Kopis", 20, "./img/arme1kopis.png");
  const gastrophete = new Arme("Gastrophète", 30, "./img/arme2gastrophete.png");
  const sarisse = new Arme("Sarisse", 40, "./img/arme3sarisse.png");
  const lamedares = new Arme("Lame d'Arès", 50, "./img/arme4lamedares.png");
  tableauArmes.push(kopis, gastrophete, sarisse, lamedares);

  /**
   * Je crée mes persos et je les stockes dans un tabeau.
   */
  let tableauPersos = [];
  const ajax = new Perso("Ajax", 100, 10, "./img/ajax.png");
  const cyber = new Perso("Cyber", 100, 10, "./img/cyber.png");
  tableauPersos.push(ajax, cyber);

  /**
   * Je crée mon plateau de jeu avec mes 2 tableaux : tableauPersos et tableauArmes.
   * Je lance ma méthode drawplateau pour générer mon plateau de jeu.
   * Je lance ma méthode deplacementAutorisé pour initialiser les premiers déplacements du joueur Ajax
   * et ainsi commencé la partie.
   */
  const plateau = new Plateau(tableauPersos, tableauArmes);
  plateau.drawPlateau(tableauPersos, tableauArmes);
  plateau.deplacementAutorise(ajax, tableauPersos);

  /**
   * J'affiche les infos de mes personnages dans mon HTML
   */
  $("#santeAjax").text(ajax.sante);
  $("#santeCyber").text(cyber.sante);
  $("#degatAjax").text(ajax.degat);
  $("#degatCyber").text(cyber.degat);

  /**
   * J'ajoute les méthodes attaque et défense aux boutons associés à chaques joueurs
   */
  $("#attaque-ajax").click("click", function () {
    ajax.attaque(tableauPersos, plateau);
  });
  $("#defense-ajax").click("click", function () {
    ajax.defense(tableauPersos, plateau);
  });

  $("#attaque-cyber").click("click", function () {
    cyber.attaque(tableauPersos, plateau);
  });
  $("#defense-cyber").click("click", function () {
    cyber.defense(tableauPersos, plateau);
  });
});