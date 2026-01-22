describe("API – Ajout d’un produit au panier", () => {
  
  before(() => {
    // Authentification via l’API et stockage du token
    cy.storeAuthToken();
  });

  it("Doit ajouter un produit disponible au panier avec succès", () => {
    const token = Cypress.env("authToken");
    const productIdToAdd = 4;
    const quantityToAdd = 1;

    cy.addToCartAPI(token, productIdToAdd, quantityToAdd).then((response) => {
      
      // Vérification du statut HTTP
      expect([200, 201]).to.include(response.status);

      // Vérification que le produit ajouté existe dans orderLines
      const orderLine = response.body.orderLines.find(
        (line) => line.product.id === productIdToAdd
      );
      expect(orderLine).to.exist;

      // Vérification de la quantité ajoutée
      expect(orderLine.quantity).to.eq(quantityToAdd);
    });
  });

});
