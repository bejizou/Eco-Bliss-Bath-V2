
describe("API – Ajout d’une grande quantité avec stock insuffisant", () => {

  before(() => {
    // Authentification via l’API et stockage du token
    return cy.storeAuthToken(); // 🔹 return pour que Cypress attende la fin
  });

  it("Doit refuser l’ajout au panier si la quantité plus de 20", () => {
    const productId = 5;

    // Récupération de la fiche produit
    cy.getProductById(productId).then((productResponse) => {
      expect(productResponse.status).to.eq(200);

      const stockAvailable = productResponse.body.availableStock;
      const quantity =  21; // volontairement supérieure au stock

      cy.log(`Stock disponible : ${stockAvailable}`);
      cy.log(`Quantité demandée : ${quantity}`);

      // Récupération du token DANS le then pour être sûr qu'il est disponible
      const token = Cypress.env("authToken");

      cy.addToCartAPI(token, productId, quantity).then((response) => {
        // Résultat attendu : refus si stock insuffisant
         // Le serveur doit refuser l’ajout
           expect(
          response.status,
          `Ajout refusé attendu : stock (${stockAvailable}) < quantité (${quantity})`
        ).to.eq(400);
      
      
      });
    });
  });
});
