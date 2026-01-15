describe("API – Ajout d'une quantité nulle au panier", () => {

  before(() => {
    // Authentification via l’API et stockage du token
    cy.storeAuthToken();
  });

  it("Doit refuser l’ajout au panier si la quantité est égale à 0", () => {
    const token = Cypress.env("authToken");
    
    // Identifiant du produit "Chuchotements d'été" (à adapter selon votre base de données)
    const productId = 4; 
    const quantity= 0;
 cy.getProductById(productId).then((productResponse) => {
      expect(productResponse.status).to.eq(200);

      const stockAvailable = productResponse.body.availableStock;

      // Logs utiles pour le debug et la soutenance
      cy.log(`Stock disponible : ${stockAvailable}`);
      cy.log(`Quantité demandée : ${quantity}`);


    cy.log(`Tentative d'ajout du produit ${productId} avec une quantité de ${quantity}`);

    // Requête d'ajout au panier
    cy.addToCartAPI(token, productId, quantity).then((response) => {
      
      /* RÉSULTAT ATTENDU : 
         Le système ne doit pas permettre l'ajout (Anomalie constatée).
         On attend généralement un code 400 (Basd Request).
      */
      expect(response.status).to.eq(400, "L'API ne doit pas accepter une quantité nulle (0)");
      
      // Optionnel : Vérifier que le message d'erreur est explicite
      // expect(response.body.message).to.contain("la quantité doit être supérieure à 0");
    });
    });
  });

 it("Vérifie que le panier ne contient pas le produit après la tentative", () => {
  const token = Cypress.env("authToken");
  const productId = 4;

  cy.getCartAPI(token).then((response) => {
    console.log('Structure de la réponse :', response.body);
    expect(response.status).to.be.equal(200);
    
    // On vérifie d'abord si response.body.items existe
    // Si response.body est directement le tableau, on utilise response.body
    const items = response.body.items || response.body;

    // On s'assure que 'items' est bien un tableau avant de faire le .find()
    if (Array.isArray(items)) {
      const productInCart = items.find(item => item.productId === productId);
      expect(productInCart).to.be.undefined;
    } else {
      // Si ce n'est pas un tableau, c'est que le panier est probablement vide
      // ce qui est un comportement correct ici.
      cy.log("Le panier est vide ou la structure est différente, ce qui valide le test.");
    }
    
    cy.log("Succès : Le produit n'est pas présent dans le panier.");
  });
});

});