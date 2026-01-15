describe("API – Ajout d’une quantité supérieure au stock disponible", () => {

  before(() => {
    // Authentification via l’API et stockage du token
    cy.storeAuthToken();
  });

  it("Doit refuser l’ajout au panier si la quantité demandée dépasse le stock", () => {
    const token = Cypress.env("authToken");

    const productId = 7;        // Produit avec stock limité
    const quantityOverStock = 10; // Quantité volontairement trop élevée

    // Tentative d’ajout d’une quantité supérieure au stock
    cy.addToCartAPI(token, productId, quantityOverStock).then((response) => {

      // Résultat attendu : refus côté serveur
      expect(
        response.status,
        "L’API doit refuser l’ajout d’une quantité supérieure au stock"
      ).to.eq(400);
    });
  });

});
