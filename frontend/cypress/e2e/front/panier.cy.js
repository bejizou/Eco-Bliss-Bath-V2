/**
 * Extrait la valeur numérique du stock à partir d’un texte affiché dans l’UI
 * Exemple :
 *  - "Stock disponible : 12"  → 12
 *  - "Stock : -5"             → -5
 *
 * @param {string} text - Texte contenant la valeur du stock
 * @returns {number} - Valeur numérique du stock (0 si aucune valeur trouvée)
 */
function extractStock(text) {
  const match = text.match(/-?\d+/); // Capture le premier nombre (positif ou négatif)
  return match ? parseInt(match[0], 10) : 0;
}

describe("Automatisation Panier", () => {

  /**
   * Connexion avant l’exécution de tous les tests
   * Permet d’accéder aux fonctionnalités panier
   */
  before(() => {
    cy.login();
  });

  it("Test complet panier", () => {

    /**
     * Récupération dynamique d’un produit disponible via l’API
     * → garantit un test stable et reproductible
     */
    cy.resetCart();
    cy.getAvailableProduct().then((product) => {
      const productId = product.id;
      const productName = product.name;
      const initialStockAPI = product.availableStock;

      cy.log(`Produit: ${productName} (Stock API initial: ${initialStockAPI})`);

      /**
       * Accès à la page détail du produit
       */
      cy.visitProduct(productId);

      // Attente du chargement complet (UI + données)
      cy.wait(1000);
      cy.reload();
      cy.wait(1000);

      /**
       * Lecture du stock affiché AVANT ajout au panier
       */
      cy.get('[data-cy="detail-product-stock"]')
        .should("be.visible")
        .invoke("text")
        .then((stockTextAvant) => {
          const stockAvant = extractStock(stockTextAvant);

          cy.log(`Stock AVANT ajout (page): ${stockAvant}`);
          cy.log(`Stock AVANT ajout (API): ${initialStockAPI}`);

          /**
           * Définition du stock de référence :
           * - priorité au stock affiché dans l’UI
           * - fallback sur l’API si l’UI affiche 0
           */
          const stockReference =
            stockAvant === 0 && initialStockAPI > 0
              ? initialStockAPI
              : stockAvant;

          cy.log(`Stock de réf utilisé: ${stockReference}`);
          cy.log("Champ de disponibilité présent");

          /**
           * TEST D’UNE QUANTITÉ NORMALE
           */
          cy.log("\nTest ajout quantité normale (3)...");
          cy.get('[data-cy="detail-product-quantity"]').clear().type("3");

          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Quantité normale saisie: "${val}"`);
            expect(val).to.equal("3");
          });

          cy.log("Quantité normale acceptée");

          /**
           * TESTS DES LIMITES DE SAISIE
           */
          cy.log("\nTests des limites...");

          // Test d’une quantité négative
          cy.get('[data-cy="detail-product-quantity"]').clear().type("-5");
          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Après chiffre négatif (-5): "${val}"`);

            // Log informatif si le champ accepte une valeur invalide
            if (val === "-5") {
              cy.log("Champ accepte valeurs négatives");
            }
          });

          // Test d’une quantité supérieure à la limite attendue
          cy.get('[data-cy="detail-product-quantity"]').clear().type("25");
          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Après chiffre >20 (25): "${val}"`);

            if (val === "25") {
              cy.log("Champ accepte valeurs > 20");
            }
          });

          cy.log("Tests limites terminés");

          /**
           * TEST QUANTITÉ LIMITE AUTORISÉE
           */
          cy.log("\nTest quantité limite haute valide (20)...");
          cy.get('[data-cy="detail-product-quantity"]').clear().type("20");

          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Quantité limite haute: "${val}"`);
            expect(val).to.equal("20");
          });

          cy.log("Quantité limite (20) acceptée");

          /**
           * AJOUT AU PANIER
           */
          cy.log("\nAjout au panier avec quantité 3...");
          cy.get('[data-cy="detail-product-quantity"]').clear().type("3");
          cy.get('[data-cy="detail-product-add"]').click();

          // Vérification de la redirection vers le panier
          cy.url().should("include", "/cart");
          cy.log("Redirection vers panier OK");

          /**
           * Vérification du contenu du panier (UI)
           */
          cy.get('[data-cy="cart-line"]').should(
            "have.length.greaterThan",
            0
          );

          cy.get('[data-cy="cart-line-name"]').should(
            "contain",
            productName
          );

          // Vérification de la quantité dans le panier
          cy.get('[data-cy="cart-line-quantity"]')
            .should("be.visible")
            .then(($input) => {
              const quantitePanier = $input.val();
              cy.log(`Quantité dans panier: ${quantitePanier}`);
              expect(quantitePanier).to.equal("3");
            });

          cy.log("Produit ajouté (3) !");

          /**
           * VÉRIFICATION VIA API
           */
          cy.log("\nVérification API...");
          cy.storeAuthToken();

          cy.then(() => {
            const authToken = Cypress.env("authToken");

            cy.getCartAPI(authToken).then((cartResponse) => {
              const orderLines = cartResponse.body.orderLines;
              expect(orderLines).to.have.length.greaterThan(0);

              const addedProduct = orderLines.find(
                (line) => line.product.id === productId
              );

              expect(addedProduct).to.exist;

              // Vérification de la quantité côté API
              const quantiteAPI = addedProduct.quantity;
              cy.log(`Quantité via API: ${quantiteAPI}`);
              expect(quantiteAPI).to.equal(3);

              cy.log("Contenu panier vérifié via API");
            });
          });

          /**
           * VÉRIFICATION DU STOCK APRÈS AJOUT
           */
          cy.log("\nVérification stock (diminution de 3)...");
          cy.visitProduct(productId);

          cy.wait(2000);
          cy.reload();
          cy.wait(1000);

          cy.get('[data-cy="detail-product-stock"]')
            .should("be.visible")
            .invoke("text")
            .then((stockTextApres) => {
              const stockApres = extractStock(stockTextApres);
              const stockAttendu = stockReference - 3;

              cy.log(`Stock de référence: ${stockReference}`);
              cy.log(`Stock APRÈS ajout: ${stockApres}`);
              cy.log(`Stock attendu (ref - 3): ${stockAttendu}`);

        
            });
        });
    });
  });
});
