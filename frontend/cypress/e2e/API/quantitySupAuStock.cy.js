describe("API – Ajout d’une quantité supérieure au stock disponible", () => {

  before(() => {
    return cy.storeAuthToken(); // 🔹 return pour que Cypress attende
  });

  it("Doit refuser l’ajout au panier si la quantité demandée dépasse le stock", () => {
    const productId = 4;

    cy.getProductById(productId).then((productResponse) => {
      expect(productResponse.status).to.eq(200);

      const stockAvailable = productResponse.body.availableStock;
      const quantityOverStock = stockAvailable + 18; //  toujours supérieure au stock

       cy.log(`Stock disponible : ${stockAvailable}`);
      cy.log(`Quantité demandée : ${quantityOverStock}`);
      const token = Cypress.env("authToken");

      cy.addToCartAPI(token, productId, quantityOverStock).then((response) => {
          
        expect(
          response.status,
          `L’API doit refuser l’ajout d’une quantité (${quantityOverStock}) 
          supérieure au stock (${stockAvailable})`
        ).to.eq(400);
       
      
      });
    });
  });

});
