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
      
      /* 
         Le système ne doit pas permettre l'ajout (Anomalie).
         On attend généralement un code 400 (Basd Request).
      */
      expect(response.status).to.eq(400, "L'API ne doit pas accepter une quantité nulle (0)");
      
     
    });
    });
  });


});