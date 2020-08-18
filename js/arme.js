// ================================================================================================================================================//
// ============================================================= Objet Arme ======================================================================//
class Arme {

  // Initialise les armes
  constructor(nom, degat, image) {
    this.nom = nom;
    this.degat = degat;
    this.surLePlateau = false;
    this.image = image;


  }

  // Renvoie la description de l'arme
  decrireArme() {
    const description = this.nom + " fait " + this.degat + " points de dégâts";
    return description;
  }


};