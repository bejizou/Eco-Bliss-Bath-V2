describe("UI – Champs de connexion", () => {

  it("Les champs Email, Mot de passe et le bouton S'inscrire doivent être visibles", () => {
    cy.visit("http://localhost:4200/#/");

    // Accès au formulaire de connexion
    cy.get('[data-cy="nav-link-login"]').should("be.visible").click();

    // Vérification de la présence des champs et boutons
    cy.get('[data-cy="login-input-username"]').should("exist"); // Email
    cy.get('[data-cy="login-input-password"]').should("exist"); // Mot de passe
    cy.get('[data-cy="login-submit"]').should("be.visible"); // Bouton Se connecter
    cy.contains("S'inscrire").should("be.visible"); // Bouton S'inscrire
  });

});
describe("UI – Bouton Connexion sur la page d’accueil", () => {

  it('Le bouton "Connexion" doit être visible sur la page d’accueil', () => {
    // Accès à la page d’accueil
    cy.visit("http://localhost:4200/#/");

    // Vérification de la présence du bouton Connexion
    cy.get('[data-cy="nav-link-login"]').should("be.visible");
  });


it("Test 3 : Login message, merci de remplir correctement tous les champs", () => {
  cy.visit("http://localhost:4200/#/");

  cy.get('[data-cy="nav-link-login"]').click();

  cy.get('[data-cy="login-submit"]').click();

  cy.get('[data-cy="login-errors"]')
    .should("be.visible")
    .and("contain", "Merci de remplir correctement tous les champs");
});




});

