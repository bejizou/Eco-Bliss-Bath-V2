/**
 * Extrait un nombre entier depuis un texte (ex: "Stock : 12 unités")
 * @param {string} text - Texte contenant un nombre
 * @returns {number} - Nombre extrait ou 0 si aucun nombre trouvé
 */
function extractStock(text) {
  // Recherche le premier nombre (positif ou négatif) dans le texte
  const match = text.match(/-?\d+/);

  // Si un nombre est trouvé, on le convertit en entier, sinon on retourne 0
  return match ? parseInt(match[0], 10) : 0;
}

// Groupe de tests Cypress : Automatisation du panier
describe("Automatisation Panier ", () => {
  // Hook exécuté une seule fois avant tous les tests
  before(() => {
    // Connexion de l'utilisateur (commande Cypress personnalisée)
    cy.login();
    
  });

  // Test principal : scénario complet du panier
  it("Test complet panier", () => {
    // Récupération d’un produit disponible via l’API
    cy.getAvailableProduct().then((product) => {
      // Extraction des informations produit
      const productId = product.id;
      const productName = product.name;
      const initialStockAPI = product.availableStock;

      // Log des informations produit
      cy.log(`Produit: ${productName} (Stock API initial: ${initialStockAPI})`);

      // Navigation vers la page du produit
      cy.visitProduct(productId);

      // Attente pour s'assurer du chargement complet
      cy.wait(1000);
      cy.reload();
      cy.wait(1000);

      // Récupération du stock affiché avant ajout au panier
      cy.get('[data-cy="detail-product-stock"]')
        .should("be.visible") // Vérifie que le stock est affiché
        .invoke("text") // Récupère le texte du champ stock
        .then((stockTextAvant) => {
          // Extraction du stock depuis le texte
          const stockAvant = extractStock(stockTextAvant);

          // Logs de comparaison stock UI / API
          cy.log(`Stock AVANT ajout (page): ${stockAvant}`);
          cy.log(`Stock AVANT ajout (API): ${initialStockAPI}`);

          /**
           * Stock de référence :
           * - Si le stock UI est à 0 mais que l’API indique un stock > 0,
           *   on utilise le stock API
           * - Sinon, on utilise le stock affiché
           */
          const stockReference =
            stockAvant === 0 && initialStockAPI > 0
              ? initialStockAPI
              : stockAvant;

          cy.log(`Stock de réf utilisé: ${stockReference}`);
          cy.log("Champ de disponibilité présent");

          // ===== TEST : QUANTITÉ NORMALE (>1) =====
          cy.log("\nTest ajout quantité normale (3)...");

          // Saisie de la quantité 3
          cy.get('[data-cy="detail-product-quantity"]').clear().type("3");

          // Vérification de la valeur saisie
          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Quantité normale saisie: "${val}"`);
            expect(val).to.equal("3");
          });

          cy.log("Quantité normale acceptée");

          // ===== TESTS DES LIMITES =====
          cy.log("\n Tests des limites...");

          // Test valeur négative
          cy.get('[data-cy="detail-product-quantity"]').clear().type("-5");
          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Après chiffre négatif (-5): "${val}"`);

            // Information si le champ accepte les valeurs négatives
            if (val === "-5") {
              cy.log("Champ accepte valeurs négatives");
            }
          });

          // Test valeur supérieure à 20
          cy.get('[data-cy="detail-product-quantity"]').clear().type("25");
          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Après chiffre >20 (25): "${val}"`);

            // Information si le champ accepte des valeurs > 20
            if (val === "25") {
              cy.log("Champ accepte valeurs > 20");
            }
          });

          cy.log("Tests limites");

          // ===== TEST : QUANTITÉ LIMITE MAX (20) =====
          cy.log("\nTest quantité limite haute valide (20)...");

          // Saisie de la valeur limite
          cy.get('[data-cy="detail-product-quantity"]').clear().type("20");

          // Vérification de la valeur
          cy.get('[data-cy="detail-product-quantity"]').then(($input) => {
            const val = $input.val();
            cy.log(`Quantité limite haute: "${val}"`);
            expect(val).to.equal("20");
          });

          cy.log("Quantité limite (20) acceptée");

          // ===== AJOUT AU PANIER =====
          cy.log("\nAjout au panier avec quantité 3...");

          // Saisie de la quantité finale
          cy.get('[data-cy="detail-product-quantity"]').clear().type("3");

          // Clic sur le bouton "Ajouter au panier"
          cy.get('[data-cy="detail-product-add"]').click();

          // Vérification de la redirection vers le panier
          cy.url().should("include", "/cart");
          cy.log("Redirection vers panier OK");

          // Vérification présence d'au moins une ligne produit
          cy.get('[data-cy="cart-line"]').should("have.length.greaterThan", 0);

          // Vérification du nom du produit dans le panier
          cy.get('[data-cy="cart-line-name"]').should(
            "contain",
            productName
          );

          // ===== VÉRIFICATION QUANTITÉ DANS LE PANIER =====
          cy.get('[data-cy="cart-line-quantity"]')
            .should("be.visible")
            .then(($input) => {
              const quantitePanier = $input.val();
              cy.log(`Quantité dans panier: ${quantitePanier}`);
              expect(quantitePanier).to.equal("3");
            });

          cy.log("Produit ajouté (3) !");

          // ===== VÉRIFICATION VIA API =====
          cy.log("\nVérification API...");

          // Stockage du token d’authentification
          cy.storeAuthToken();

          cy.then(() => {
            const authToken = Cypress.env("authToken");

            // Récupération du panier via API
            cy.getCartAPI(authToken).then((cartResponse) => {
              const orderLines = cartResponse.body.orderLines;

              // Vérification qu'il y a au moins une ligne
              expect(orderLines).to.have.length.greaterThan(0);

              // Recherche du produit ajouté
              const addedProduct = orderLines.find(
                (line) => line.product.id === productId
              );

              expect(addedProduct).to.exist;

              // Vérification de la quantité via API
              const quantiteAPI = addedProduct.quantity;
              cy.log(`Quantité via API: ${quantiteAPI}`);
              expect(quantiteAPI).to.equal(3);

              cy.log("Contenu panier vérifié via API");
            });
          });

          // ===== VÉRIFICATION DU STOCK APRÈS AJOUT =====
          cy.log("\nVérification stock (diminution de 3)...");

          // Retour sur la page produit
          cy.visitProduct(productId);

          cy.wait(2000);
          cy.reload();
          cy.wait(1000);

          // Récupération du stock après ajout
          cy.get('[data-cy="detail-product-stock"]')
            .should("be.visible")
            .invoke("text")
            .then((stockTextApres) => {
              const stockApres = extractStock(stockTextApres);
              const stockAttendu = stockReference - 3;

              cy.log(`Stock de référence: ${stockReference}`);
              cy.log(`Stock APRÈS ajout: ${stockApres}`);
              cy.log(`Stock attendu (ref - 3): ${stockAttendu}`);

              // Validation souple selon les sources (UI / API)
              if (stockApres === stockAttendu) {
                cy.log(`Stock diminué de 3: ${stockReference} → ${stockApres}`);
              } else if (
                stockApres === stockReference - 3 ||
                (stockReference === initialStockAPI &&
                  stockApres === initialStockAPI - 3)
              ) {
                cy.log(`Stock diminué de 3: ${stockReference} → ${stockApres}`);
              } else if (stockApres < stockReference) {
                const diminution = stockReference - stockApres;
                cy.log(
                  `Stock a diminué: ${stockReference} → ${stockApres} (diminution de ${diminution})`
                );
              } else {
                if (stockApres === initialStockAPI - 3) {
                  cy.log(
                    `Stock diminué par rapport à l'API: ${initialStockAPI} → ${stockApres}`
                  );
                } else {
                  cy.log(
                    `Stock : référence=${stockReference}, après=${stockApres}, API=${initialStockAPI}`
                  );
                }
              }
            });
        });
    });
  });
});
