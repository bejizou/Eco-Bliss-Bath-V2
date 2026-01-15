describe("API – Ajout d’un avis", () => {
  
  before(() => {
    // Connexion via l'API et stockage du token d’authentification
    cy.storeAuthToken();
  });

  it("Doit ajouter un avis et retourner un statut 200 ou 201", () => {
    const token = Cypress.env("authToken");

    // Récupération des données de l’avis depuis le fixture
    cy.fixture("review").then((reviewData) => {

      // Appel POST pour créer l’avis
      cy.request({
        method: "POST",
        url: "http://localhost:8081/reviews",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: reviewData,
      }).then((response) => {

        // Vérification du statut HTTP
        expect([200, 201]).to.include(response.status);

        // Vérification des propriétés essentielles de l’avis
        expect(response.body).to.have.property("rating");
        expect(response.body).to.have.property("title");
        expect(response.body).to.have.property("comment");
      });
    });
  });


it("Doit refuser l'ajout d'un avis sans authentification (Erreur 401)", () => {
    cy.fixture("review").then((reviewData) => {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/reviews",
        failOnStatusCode: false, // Obligatoire pour ne pas faire échouer le test Cypress sur une erreur 401
        headers: {
          // On n'envoie PAS de header Authorization ici
        },
        body: reviewData,
      }).then((response) => {
        // Vérification demandée par votre document de test
        expect(response.status).to.be.equal(401, "L'API doit renvoyer une erreur 401 Unauthorized");
      });
    });
  });


});
