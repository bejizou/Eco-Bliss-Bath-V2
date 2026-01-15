//Les attaques XSS consistent à insérer 
// un code malveillant dans des sites Web par ailleurs fiables
describe("Sécurité – Protection contre les injections XSS dans les commentaires", () => {
  const xssPayload = "<img src=x onerror=alert('XSS') />";

  before(() => {
    // Connexion préalable pour accéder à la page des avis
    cy.login();
  });

  it("Doit empêcher l’interprétation ou l’affichage d’un contenu XSS injecté", () => {

    // Accès à la section des avis
    cy.contains("Avis").click();

    // Saisie d'un commentaire contenant un script malveillant
    cy.get('[data-cy="review-input-rating-images"]').first().click();
    cy.get('[data-cy="review-input-title"]')
      .clear()
      .type("Test faille XSS");

    cy.get('[data-cy="review-input-comment"]')
      .clear()
      .type(xssPayload);

    // Soumission du commentaire
    cy.get('[data-cy="review-submit"]').click();

    // Vérifications de sécurité : aucune exécution ou rendu HTML du payload
    cy.get("body").should("not.contain.html", xssPayload); 
    cy.get("body").should("not.contain", "alert");

    // Vérification que le contenu malveillant n'est pas affiché tel quel
    cy.contains(xssPayload).should("not.exist");
  });
});
