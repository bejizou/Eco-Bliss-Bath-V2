describe('template spec', () => {

  describe("Test fonctionnel - Connexion utilisateur", () => {

    it("L'utilisateur peut se connecter et voir le bouton Panier", () => {
      cy.login(); 
      cy.get('[data-cy="nav-link-cart"]').should("be.visible");
    });

  });

});
