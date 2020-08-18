// ================================================================================================================================================//
// ============================================================= Objet Perso ======================================================================//
class Perso {
  // initialise les personnages avec les paramètres nom santé dégât et elm qui correspond à l' élément html.
  constructor(nom, sante, degat, image) {
    this.nom = nom;
    this.sante = sante;
    this.degat = degat;
    this.image = image;
    this.x = 0;
    this.y = 0;
    this.surLePlateau = false; // par défaut le personnage n'est pas sur le plateau
    this.armeEquipee = {};
    this.posture = "";
  }

  // renvoie la description des personnages
  decrirePerso() {
    const description = this.nom + "possède" + this.sante + "et fait " + this.degat + " points de dégâts avec son arme";
    return description;
  }

  positionJoueurs(joueur1_x, joueur1_y, joueur2_x, joueur2_y) {
    //comparaison des nombres donc de l'écart entre les 2 positions x et les 2 positions y
    let ecart_X = Math.abs(joueur1_x - joueur2_x);
    let ecart_Y = Math.abs(joueur1_y - joueur2_y);

    if ((ecart_X === 1 && ecart_Y === 0) || (ecart_X === 0 && ecart_Y === 1)) {
      return true;
    } else return false;

    // si le résultat de la comparaison est true, les joueurs sont à côté
    // si le résultat de la comparaison est false, les joueurs ne sont à côté
  }

  mouvement(futureCase, tableauPersos, plateau) {
    let anciennePosition = plateau.plateauArray.find((mesCases) => mesCases.perso.nom === this.nom); // on récup l'ancienne position
    if (futureCase.arme.surLePlateau) {
      if (this.degat === 10) {
        this.armeEquipee = {
          ...futureCase.arme,
        };

        this.degat = this.armeEquipee.degat;
        this.armeEquipee.surLePlateau = false;

        futureCase.arme = {};
        futureCase.elem.classList.remove("nouvelleCaseArme");
      } else if (this.degat > 10) {
        let armeDeposee = this.armeEquipee;
        this.armeEquipee = {
          ...futureCase.arme,
        };
        this.armeEquipee.surLePlateau = false;
        this.degat = this.armeEquipee.degat;
        futureCase.arme = {
          ...armeDeposee,
        };
        futureCase.arme.surLePlateau = true;
      }

      if (this.nom === "Ajax") {
        document.getElementById("degatAjax").innerHTML = this.armeEquipee.degat;
        document.getElementById("imageArmeAjax").src = this.armeEquipee.image;
      } else if (this.nom === "Cyber") {
        document.getElementById("degatCyber").innerHTML = this.armeEquipee.degat;
        document.getElementById("imageArmeCyber").src = this.armeEquipee.image;
      }
    }

    anciennePosition.perso = {};
    anciennePosition.accessible = true; // la case anciennement occupée redevient  accessible
    anciennePosition.elem.classList.remove("personnage"); //je supprime le personnage de mon ancienne case
    anciennePosition.elem.style.backgroundImage = "none";
    this.x = futureCase.x;
    this.y = futureCase.y;

    futureCase.elem.classList.remove("caseDeplacement"); // on supprime la class de déplacement sur notre future case
    futureCase.accessible = false; // la case n'est plus accessible
    futureCase.elem.classList.add("personnage"); // On ajoute la classe personnage
    futureCase.perso = {
      ...this,
    }; // on injecte le nouvel objet personnage dans la nouvelle case perso
    futureCase.elem.style.backgroundImage = `url(${futureCase.perso.image})`;
    /**
     * Si sur mon ancienne case il y a une arme , je n'oublie pas de l'afficher grâce à son image
     */
    if (anciennePosition.arme.surLePlateau === true) {
      anciennePosition.elem.style.backgroundImage = `url(${anciennePosition.arme.image})`;
    }

    plateau.plateauArray.map((mesCases) => mesCases.elem.classList.remove("caseDeplacement")); // une fois le déplacement fait, on suprrime tous les déplacements
    plateau.plateauArray.filter((mesCases) => mesCases.elem.onclick).map((mesCases) => (mesCases.elem.onclick = null));

    if (this.positionJoueurs(tableauPersos[0].x, tableauPersos[0].y, tableauPersos[1].x, tableauPersos[1].y)) {
      alert("Le combat commence !");
      plateau.combat(this, tableauPersos);
    } else if (!this.positionJoueurs(tableauPersos[0].x, tableauPersos[0].y, tableauPersos[1].x, tableauPersos[1].y)) {
      // Après avoir effectué le déplacement, je change de joueur
      if (this.nom === "Ajax") {
        // si joueur Ajax
        plateau.deplacementAutorise(tableauPersos[1], tableauPersos); // on déclenche la méthode avec tableau perso 1 qui représente l'objet Cyber
      } else if (this.nom === "Cyber") {
        // si joueur = Cyber
        plateau.deplacementAutorise(tableauPersos[0], tableauPersos); // on déclenche la méthode avec Ajax
      }
    }
  }

  attaque(tableauPersos, plateau) {
    let ajax = tableauPersos[0];
    let cyber = tableauPersos[1];

    let joueur = this;

    /**
     * Si Ajax attaque je lui ajoute la posture "Attaque".
     * Je check si Cyber à une posture "Defense" ou non.
     *
     * Je soustrait les points de vies à Cyber suivant les dégats d'Ajax
     * divisé ou non par la posture de Cyber.
     *
     * J'affiche les nouvelles données dans mon HTML
     */
    if (joueur.nom === "Ajax") {
      ajax.posture = "Attaque";

      if (cyber.posture === "Defense") {
        cyber.sante = cyber.sante - ajax.degat / 2;
      } else if (cyber.posture != "Defense") {
        cyber.sante = cyber.sante - ajax.degat;
      }

      $("#santeCyber").text(cyber.sante);
      $("#postureAjax").text(ajax.posture);

      plateau.combat(cyber, tableauPersos);

      /**
       * Si Cyber attaque je lui ajoute la posture "Attaque".
       * Je check si Ajax à une posture "Defense" ou non.
       *
       * Je soustrait les points de vies à Ajax suivant les dégats de Cyber
       * divisé ou non par la posture de Ajax.
       *
       * J'affiche les nouvelles données dans mon HTML
       */
    } else if (joueur.nom === "Cyber") {
      cyber.posture = "Attaque";

      if (ajax.posture === "Defense") {
        ajax.sante = ajax.sante - cyber.degat / 2;
      } else if (cyber.posture != "Defense") {
        ajax.sante = ajax.sante - cyber.degat;
      }

      $("#santeAjax").text(ajax.sante);
      $("#postureCyber").text(ajax.posture);

      plateau.combat(ajax, tableauPersos);
    }
  }

  defense(tableauPersos, plateau) {
    let ajax = tableauPersos[0];
    let cyber = tableauPersos[1];

    let joueur = this;

    /**
     * Si Ajax choisit de se défendre, je lui ajoute la posture "Defense"
     */
    if (joueur.nom === "Ajax") {
      ajax.posture = "Defense";
      $("#postureAjax").text(ajax.posture);

      plateau.combat(cyber, tableauPersos);

      /**
       * Si Cyber choisit de se défendre, je lui ajoute la posture "Defense"
       */
    } else if (joueur.nom === "Cyber") {
      cyber.posture = "Defense";
      $("#postureCyber").text(cyber.posture);

      plateau.combat(ajax, tableauPersos);
    }
  }
}