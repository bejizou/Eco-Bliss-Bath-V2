

describe("Sécurité – Protection contre les injections XSS dans les commentaires", () => {
  const xssPayload = "<img src=x onerror=alert('XSS') />";

  before(() => {
    cy.login();
  });

  it("Doit empêcher l’exécution ou l’affichage d’un contenu XSS injecté", () => {
    cy.contains("Avis").click();

    cy.get('[data-cy="review-input-rating-images"]').first().click();
    cy.get('[data-cy="review-input-title"]').clear().type("Test faille XSS");
    cy.get('[data-cy="review-input-comment"]').clear().type(xssPayload);

  

    cy.get('[data-cy="review-submit"]').click();
  
    // Vérifie que le commentaire n’est pas affiché tel quel
    cy.get("body").should("not.contain.html", xssPayload); // non interprété comme HTML
 


    // Vérification que le payload n'est pas injecté tel quel
    cy.get('[data-cy="review-detail"]').first().within(() => {
      cy.get('[data-cy="review-comment"]').should(($p) => {
        const html = $p.html();
        expect(html).to.not.include(xssPayload); // pas d'exécution
      });
    });
  });
});
