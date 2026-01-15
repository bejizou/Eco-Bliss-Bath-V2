describe("API – Accès authentifié au panier", () => {
  let authToken;

  before(() => {
    // Connexion via l’API pour récupérer le token
    cy.loginByAPI().then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.token;
    });
  });

  it("Doit retourner la liste des produits présents dans le panier", () => {
    cy.getCartAPI(authToken).then((response) => {
      expect(response.status).to.eq(200);

      // Vérification que la propriété orderLines existe et est un tableau
      expect(response.body).to.have.property("orderLines");
      expect(response.body.orderLines).to.be.an("array");
    });
  });
});
