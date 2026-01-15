describe("UI – Ajouter un produit au panier après connexion", () => {

  it("L'utilisateur connecté peut voir et interagir avec le bouton Ajouter au panier", () => {
    // Connexion via commande personnalisée
    cy.login();

    // Accès à la liste des produits
    cy.contains("button", "Voir les produits").should("be.visible").click();

    // Vérification qu’au moins un produit est affiché
    cy.get('[data-cy="product-link"]').should("have.length.at.least", 1);

    // Test de chaque bouton "Consulter" des produits
    cy.get('[data-cy="product-link"]').each(($btn, index, $list) => {
      cy.log(`Test du produit n°${index + 1}`);

      // Clic sur le bouton Consulter du produit courant
      cy.get('[data-cy="product-link"]').eq(index).click();

      // Vérification de la présence du bouton Ajouter au panier
      cy.get('[data-cy="detail-product-add"]').should("be.visible");

      // Retour à la liste des produits
      cy.go("back");

      // Vérification que tous les boutons Consulter sont toujours présents
      cy.get('[data-cy="product-link"]').should("have.length", $list.length);
    });

    // Déconnexion à la fin du test
    cy.get('[data-cy="nav-link-logout"]').should("be.visible").click();
  });

});
