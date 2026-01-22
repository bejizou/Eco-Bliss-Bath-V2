describe("API – Refus d’ajout au panier avec quantité négative", () => {

  before(() => {
    cy.storeAuthToken();
  });

  it("Doit refuser l’ajout au panier si la quantité est négative", () => {
    const token = Cypress.env("authToken");
    const productId = 7;
    const quantity = -4;

    cy.getProductById(productId).then((productResponse) => {
      expect(productResponse.status).to.eq(200);

      const stockAvailable = productResponse.body.availableStock;

      cy.log(`Stock disponible : ${stockAvailable}`);
      cy.log(`Quantité demandée : ${quantity}`);

      cy.addToCartAPI(token, productId, quantity).then((response) => {

        
        
        expect(response.status).to.eq(400);

        // Assertion métier (message d’erreur API)
        expect(response.body.error.quantity[0])
          .to.eq("This value should be 0 or more.");
      });
    });
  });
});
