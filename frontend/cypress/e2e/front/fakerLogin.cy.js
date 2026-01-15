import { faker } from '@faker-js/faker';

describe("UI – Authentification", () => {

  // Test de visibilité (votre code original)
  it('Le bouton "Connexion" doit être visible sur la page d’accueil', () => {
    cy.visit("http://localhost:4200/#/");
    cy.get('[data-cy="nav-link-login"]').should("be.visible");
  });

  // Test 2 : Identifiants incorrects avec Faker
  it("Doit afficher un message d'erreur avec des identifiants incorrects", () => {
    // 1. Visiter la page d'accueil
    cy.visit("http://localhost:4200/#/");

    // 2. Cliquer sur le lien de connexion
    cy.get('[data-cy="nav-link-login"]').click();

    // Génération de données aléatoires
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password();

    // 3. Saisir un e-mail aléatoire et un mot de passe
    cy.get('[data-cy="login-input-username"]').type(fakeEmail);
    cy.get('[data-cy="login-input-password"]').type(fakePassword);

    // 4. Cliquer sur le bouton de connexion
    cy.get('[data-cy="login-submit"]').click();

    // 5. Vérifier que le message d'erreur est affiché
    // On utilise .should('be.visible') et on vérifie le texte exact
    cy.get('[data-cy="login-errors"]') 
      .should("be.visible")
      .and("contain", "Identifiants incorrects"); 
  });



it("Test 4 : Login sans last Name (Nom)", () => {
  // Étapes :
  // 1. Visiter la page d'inscription
  cy.visit("http://localhost:4200/#/register");

  // 2. Saisir un nom aléatoire (Prénom) généré par Faker
  const firstName = faker.person.firstName();
  cy.get('[data-cy="register-input-firstname"]').type(firstName);

  // 3. Saisir un e-mail aléatoire généré par Faker
  cy.get('[data-cy="register-input-email"]').type(faker.internet.email());

  // 4. Saisir un mot de passe aléatoire généré par Faker (et confirmation)
  const password = faker.internet.password();
  cy.get('[data-cy="register-input-password"]').type(password);
  cy.get('[data-cy="register-input-password-confirm"]').type(password);

  // 5. Cliquer sur le bouton d'inscription (sans avoir rempli le champ "Nom")
  cy.get('[data-cy="register-submit"]').click();

  // Attendu :
  // Le message « Merci de remplir correctement tous les champs » doit être visible
  cy.get('.alert-danger')
    .should("be.visible")
    .and("contain", "Merci de remplir correctement tous les champs");
});



describe("UI – Validation Inscription (Champ manquant)", () => {

  it("Test 5 : Login sans first Name (Prénom)", () => {
    // Étapes :
    // 1. Visiter la page d'inscription
    cy.visit("http://localhost:4200/#/register");

    // 2. Saisir un NOM aléatoire généré par Faker dans le champ « Nom »
    // Note : On remplit le nom mais on laisse le prénom vide
    cy.get('[data-cy="register-input-lastname"]').type(faker.person.lastName());

    // 3. Saisir une e-mail aléatoire généré par Faker dans le champ « E-mail »
    cy.get('[data-cy="register-input-email"]').type(faker.internet.email());

    // 4. Saisir un mot de passe aléatoire généré par Faker
    const password = faker.internet.password();
    cy.get('[data-cy="register-input-password"]').type(password);
    cy.get('[data-cy="register-input-password-confirm"]').type(password);

    // 5. Cliquer sur le bouton d'inscription (sans avoir rempli le champ « Prénom »)
    cy.get('[data-cy="register-submit"]').click();

    // Attendu : 
    // Le test réussit si le message « Merci de remplir correctement tous les champs » est visible
    cy.get('.alert-danger') // Sélecteur d'alerte standard
      .should("be.visible")
      .and("contain", "Merci de remplir correctement tous les champs");
  });

});


});