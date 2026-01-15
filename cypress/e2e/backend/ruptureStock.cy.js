describe("API – Ajout d’un produit en rupture de stock", () => {

  before(() => {
    // Authentification via l’API et stockage du token
    cy.storeAuthToken();
  });

  it("Doit retourner une erreur lors de l’ajout d’un produit en rupture (ID 3)", () => {
    const token = Cypress.env("authToken");

    // Tentative d’ajout au panier d’un produit hors stock
    cy.addToCartAPI(token, 3, 1).then((response) => {

      // Vérification que le serveur refuse l’ajout (400 Bad Request)
      cy.log(`rupture de stock pour le produit`);
      expect(response.status, 
  "Un produit en rupture de stock ne doit pas être ajouté au panier"
).to.eq(400);
    });
  });

});
