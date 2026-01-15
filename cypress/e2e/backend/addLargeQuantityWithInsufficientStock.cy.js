describe("API – Ajout d’une grande quantité avec stock insuffisant", () => {

  before(() => {
    // Authentification via l’API et stockage du token
    cy.storeAuthToken();
  });

  it("Doit refuser l’ajout au panier si la quantité demandée dépasse le stock", () => {
    const token = Cypress.env("authToken");

    const productId = 3;
    const quantity = 20; // Quantité volontairement supérieure au stock

    //  Récupération de la fiche produit
    cy.getProductById(productId).then((productResponse) => {
      expect(productResponse.status).to.eq(200);

      const stockAvailable = productResponse.body.availableStock;

      // Logs utiles pour le debug et la soutenance
      cy.log(`Stock disponible : ${stockAvailable}`);
      cy.log(`Quantité demandée : ${quantity}`);

      //   d’ajout au panier
      cy.addToCartAPI(token, productId, quantity).then((response) => {

        // Résultat attendu : refus si stock insuffisant ou négatif
        expect(
          response.status,
          `Ajout refusé attendu : stock (${stockAvailable}) < quantité (${quantity})`
        ).to.eq(400);
      });
    });
  });

});
