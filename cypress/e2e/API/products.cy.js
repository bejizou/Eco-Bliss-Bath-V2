describe("API – Récupération d’une fiche produit spécifique", () => {
  it("Doit retourner correctement la fiche du produit avec l'ID 4", () => {
    
    // Appel à l’API pour récupérer le produit
    cy.getProductById(4).then((response) => {

      // Vérification du statut HTTP
      expect(response.status).to.eq(200);

      // Vérification de l’ID du produit
      expect(response.body.id).to.eq(4);

      // Vérification des propriétés attendues dans la réponse
      expect(response.body).to.include.all.keys(
        "name",
        "description",
        "price",
        "picture"
      );
    });
  });


describe("API – Récupération des produits", () => {

  it("Test 1 : Récupération de la liste des produits (GET /products)", () => {
    
    cy.request("GET", "http://localhost:8081/products").then((response) => {
      
      // Attendu : La réponse doit contenir un code de statut 200
      expect(response.status).to.be.equal(200, "Le statut de la réponse doit être 200 OK");

      // Vérification que le corps de la réponse est bien un tableau (liste)
      const products = response.body;
      expect(products).to.be.an('array');

   
      expect(products.length).to.be.greaterThan(7, "La liste devrait contenir plus de 7 produits");

    
      cy.log(`Nombre de produits récupérés : ${products.length}`);
    });
  });

});


});
