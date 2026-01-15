describe("UI – Bouton Connexion sur la page d’accueil", () => {

  it('Le bouton "Connexion" doit être visible sur la page d’accueil', () => {
    // Accès à la page d’accueil
    cy.visit("http://localhost:4200/#/");

    // Vérification de la présence du bouton Connexion
    cy.get('[data-cy="nav-link-login"]').should("be.visible");
  });


it("Test 3 : Login message, merci de remplir correctement tous les champs", () => {
  // Étapes :
  // 1. Visiter la page d'accueil
  cy.visit("http://localhost:4200/#/");

  // 2. Cliquer sur le lien de la connexion dans la barre de navigation
  cy.get('[data-cy="nav-link-login"]').click();

  // 3. Cliquer sur le bouton de connexion sans saisir de données dans les champs
  cy.get('[data-cy="login-submit"]').click();

  // Attendu :
  // Le message « Merci de remplir correctement tous les champs » doit être visible
  cy.get('.alert-danger') // Remplacez par votre sélecteur de message d'erreur réel
    .should("be.visible")
    .and("contain", "Merci de remplir correctement tous les champs");
});




});

