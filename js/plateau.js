// ================================================================================================================================================//
// ============================================================= Objet Plateau ======================================================================//
class Plateau {
  constructor() {
    this.nombre_case_X = 10;
    this.nombre_case_Y = 10;
    this.selector = document.querySelector("#game");
    this.plateauArray = [];
    this.case = {};
  }

  /**
   * Méthod pour initialiser mon plateau de jeu
   */
  drawPlateau(tableauPersos, tableauArmes) {
    const plateau = this.selector;

    // Création de la grille du plateau + l'intégralité des objets "cases" stocké dans un tableau : plateauArray
    for (let i = 0; i < this.nombre_case_X; i++) {
      for (let j = 0; j < this.nombre_case_Y; j++) {
        const newCase = document.createElement("div");
        newCase.classList.add("case");
        plateau.appendChild(newCase);

        this.case = {
          x: i,
          y: j,
          accessible: true,
          arme: {},
          perso: {},
          elem: newCase,
        };
        this.plateauArray.push(this.case);
      }
    }

    /**  Placement de l'intégralité des cases dites "obstacles" */
    while (this.plateauArray.filter((mesCases) => !mesCases.accessible).length < 10) {
      let caseFalse = this.plateauArray[Math.floor(Math.random() * (this.nombre_case_X * this.nombre_case_Y))];

      caseFalse.accessible = false;
      caseFalse.elem.classList.replace("case", "caseObstacle");
    }

    /**  Placement de l'intégralité des cases dites "armes" + insértion de mon objet "arme" dans mon objet "case" */
    while (this.plateauArray.filter((mesCases) => mesCases.arme.surLePlateau).length < 4) {
      let armeNonPlacee = tableauArmes.filter((arme) => !arme.surLePlateau);

      let objetArme = armeNonPlacee[Math.floor(Math.random() * armeNonPlacee.length)];

      let nouvelleCaseArme = this.plateauArray.filter((mesCases) => mesCases.accessible && !mesCases.arme.surLePlateau);
      let caseArme = nouvelleCaseArme[Math.floor(Math.random() * nouvelleCaseArme.length)];
      objetArme.surLePlateau = true;

      caseArme.arme = {
        ...objetArme,
      };
      caseArme.elem.classList.add("nouvelleCaseArme");
      caseArme.elem.style.backgroundImage = `url(${caseArme.arme.image})`;
    }

    /** Placement de l'intégralité des cases dites "joueurs" + insértion de mon objet "joueur" dans mon objet "case" */

    while (this.plateauArray.filter((mesCases) => mesCases.perso.surLePlateau).length < 2) {
      /**
       * Si je n'ai pas de joueur sur mon plateau, j'en dépose 1 des 2 que je choisi de manière aléatoire.
       */
      if (this.plateauArray.filter((mesCases) => mesCases.perso.surLePlateau).length === 0) {
        let mesJoueursNonPlaces = tableauPersos.filter((perso) => !perso.surLePlateau);

        let joueurNonPlace = mesJoueursNonPlaces[Math.floor(Math.random() * mesJoueursNonPlaces.length)];

        let nouvelleCaseJoueur = this.plateauArray.filter((mesCases) => mesCases.accessible && !mesCases.arme.surLePlateau && !mesCases.perso.surLePlateau);
        let caseJoueur = nouvelleCaseJoueur[Math.floor(Math.random() * nouvelleCaseJoueur.length)];

        joueurNonPlace.x = caseJoueur.x;
        joueurNonPlace.y = caseJoueur.y;

        joueurNonPlace.surLePlateau = true;
        caseJoueur.perso = {
          ...joueurNonPlace,
        };
        caseJoueur.elem.classList.add("personnage");
        caseJoueur.elem.style.backgroundImage = `url(${caseJoueur.perso.image})`;
        /**
         * Si j'ai déjà 1 joueur sur plateau, je récupére ce joueur + celui qui n'est pas encore sur le plateau.
         * Puis je compare leurs positions grâce à ma méthode "positionJoueurs" de ma classe Perso.
         * Si elle me renvoie "false" alors mes 2 joueurs ne sont pas côte à côte, je peux donc placer mon dernier joueur.
         * Sinon je ne le place pas, et je continue ma boucle while.
         */
      } else if (this.plateauArray.filter((mesCases) => mesCases.perso.surLePlateau).length > 0) {
        let joueurEnPlace = tableauPersos.find((perso) => perso.surLePlateau);
        let joueurNonPlace = tableauPersos.find((perso) => !perso.surLePlateau);

        let nouvelleCaseJoueur = this.plateauArray.filter((mesCases) => mesCases.accessible && !mesCases.arme.surLePlateau && !mesCases.perso.surLePlateau);
        let caseJoueur = nouvelleCaseJoueur[Math.floor(Math.random() * nouvelleCaseJoueur.length)];

        joueurNonPlace.x = caseJoueur.x;
        joueurNonPlace.y = caseJoueur.y;
        if (joueurEnPlace.positionJoueurs(joueurEnPlace.x, joueurEnPlace.y, joueurNonPlace.x, joueurNonPlace.y) === false) {
          joueurNonPlace.surLePlateau = true;
          caseJoueur.perso = {
            ...joueurNonPlace,
          };
          caseJoueur.elem.classList.add("personnage");
          caseJoueur.elem.style.backgroundImage = `url(${caseJoueur.perso.image})`;
        }
      }
    }
  }

  /**
   * Méthode pour afficher les déplacements autorisés pour un joueur au début de chaque nouveau tour.
   * Insertion dun event "onclick" sur chacune des cases sur laquelle un joueur pourra se déplacer.
   * Cet event déclanchera la méthode "mouvement" se trouvant dans ma classe perso.
   */
  deplacementAutorise(joueur, tableauPersos) {
    /**
     * 4 boucles "for" représentant les 4 diréctions.
     * Chaque boucles fait 3 tours MAXIMUM, représentant le nombre de déplacement autorisé.
     * Si pour chaque tour de boucle la case est une case dite "accessible", alors je l'affiche sur mon plateau
     * Si la boucle rencontre une case obstacle ou joueur ou si elle est en bordure de plateau suivant la diréction,
     * alors la boucle s'arrête grâce à un "break".
     */
    if (joueur.nom === "Ajax") {
      $("#Ajax img").first().addClass("personnageOnfocus");
      $("#Cyber img").first().removeClass("personnageOnfocus");
    } else if (joueur.nom === "Cyber") {
      $("#Cyber img").first().addClass("personnageOnfocus");
      $("#Ajax img").first().removeClass("personnageOnfocus");
    }

    for (let i = 1; i <= 3; i++) {
      let caseDroite = this.plateauArray.find((mesCases) => mesCases.y != 0 && mesCases.y === joueur.y + i && mesCases.x === joueur.x);
      if (caseDroite && caseDroite.accessible === true) {
        caseDroite.elem.classList.add("caseDeplacement");
        caseDroite.elem.onclick = () => {
          /**
           * Déclenchement du mouvement au clique avec la future case où se trouvera le joueur.
           * Mon tableauPersos afin de pouvoir y accéder dans ma méthod mouvement.
           * "this" qui représente l'intégralité de mon plateau de jeu.
           */
          joueur.mouvement(caseDroite, tableauPersos, this);
        };
      } else if (caseDroite && !caseDroite.accessible) {
        break;
      }
    }

    for (let i = 1; i <= 3; i++) {
      let caseGauche = this.plateauArray.find((mesCases) => mesCases.y === joueur.y - i && mesCases.x === joueur.x);

      if (caseGauche && caseGauche.accessible === true) {
        caseGauche.elem.classList.add("caseDeplacement");
        caseGauche.elem.onclick = () => {
          joueur.mouvement(caseGauche, tableauPersos, this);
        };
      } else if (caseGauche && !caseGauche.accessible) {
        break;
      }
    }

    for (let i = 1; i <= 3; i++) {
      let caseHaut = this.plateauArray.find((mesCases) => mesCases.x === joueur.x - i && mesCases.y === joueur.y);
      if (caseHaut && caseHaut.accessible === true) {
        caseHaut.elem.classList.add("caseDeplacement");

        caseHaut.elem.onclick = () => {
          joueur.mouvement(caseHaut, tableauPersos, this);
        };
      } else if (caseHaut && !caseHaut.accessible) {
        break;
      }
    }

    for (let i = 1; i <= 3; i++) {
      let caseBas = this.plateauArray.find((mesCases) => joueur.x + i <= 9 && mesCases.x === joueur.x + i && mesCases.y === joueur.y);

      if (caseBas && caseBas.accessible === true) {
        caseBas.elem.classList.add("caseDeplacement");
        caseBas.elem.onclick = () => {
          joueur.mouvement(caseBas, tableauPersos, this);
        };
      } else if (caseBas && !caseBas.accessible) {
        break;
      }
    }
  }

  combat(joueur, tableauPersos) {
    /**
     * Quand le combat est lancé et à chaque tour, j'affiche les boutons du joueur qui
     * effectue son tour, et je cache ceux de l'autre joueur.
     */
    $(function () {
      if (tableauPersos[0].sante <= 0 || tableauPersos[1].sante <= 0) {
        let gagnant = tableauPersos.find((perso) => perso.sante > 0);
        $("#attaque-cyber").css({
          visibility: "hidden",
        });
        $("#defense-cyber").css({
          visibility: "hidden",
        });
        $("#attaque-ajax").css({
          visibility: "hidden",
        });
        $("#defense-ajax").css({
          visibility: "hidden",
        });
        alert(gagnant.nom + "a gagné La partie est terminé. Pour rejouer rafraîchissez la page !");
      } else if (tableauPersos[0].sante > 0 && tableauPersos[1].sante > 0) {
        if (joueur.nom === "Ajax") {
          $("#Ajax img").first().addClass("personnageOnfocus");
          $("#Cyber img").first().removeClass("personnageOnfocus");

          $("#attaque-ajax").css({
            visibility: "visible",
          });
          $("#defense-ajax").css({
            visibility: "visible",
          });

          $("#attaque-cyber").css({
            visibility: "hidden",
          });
          $("#defense-cyber").css({
            visibility: "hidden",
          });
        } else if (joueur.nom === "Cyber") {
          $("#Cyber img").first().addClass("personnageOnfocus");
          $("#Ajax img").first().removeClass("personnageOnfocus");

          $("#attaque-cyber").css({
            visibility: "visible",
          });
          $("#defense-cyber").css({
            visibility: "visible",
          });

          $("#attaque-ajax").css({
            visibility: "hidden",
          });
          $("#defense-ajax").css({
            visibility: "hidden",
          });
        }
      }
    });
  }
}