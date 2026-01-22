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


describe("UI – Validation Inscription (Champ manquant)", () => {

  it("Test : inscription sans Prénom", () => {
    cy.visit("http://localhost:4200/#/register");

    // Remplir uniquement le nom, email et mot de passe
    cy.get('[data-cy="register-input-lastname"]').type(faker.person.lastName());
    cy.get('[data-cy="register-input-email"]').type(faker.internet.email());
    const password = faker.internet.password();
    cy.get('[data-cy="register-input-password"]').type(password);
    cy.get('[data-cy="register-input-password-confirm"]').type(password);

    // Cliquer sur le bouton S'inscrire
    cy.get('[data-cy="register-submit"]').click();

    // Vérification : le message d'erreur apparaît
    cy.get('[data-cy="register-errors"]')
      .should("be.visible")
      .and("contain", "Merci de remplir correctement tous les champs");
  });

  it("Test : inscription sans Nom", () => {
    cy.visit("http://localhost:4200/#/register");

    // Remplir uniquement le prénom, email et mot de passe
    cy.get('[data-cy="register-input-firstname"]').type(faker.person.firstName());
    cy.get('[data-cy="register-input-email"]').type(faker.internet.email());
    const password = faker.internet.password();
    cy.get('[data-cy="register-input-password"]').type(password);
    cy.get('[data-cy="register-input-password-confirm"]').type(password);

    cy.get('[data-cy="register-submit"]').click();

    cy.get('[data-cy="register-errors"]')
      .should("be.visible")
      .and("contain", "Merci de remplir correctement tous les champs");
  });

});



});