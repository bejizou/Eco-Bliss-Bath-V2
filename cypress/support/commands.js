// ***********************************************
// Fichier commands.js : commandes personnalisées Cypress
// ***********************************************

// Commande personnalisée

Cypress.Commands.add("login", () => {
  const baseUrl = Cypress.config("baseUrl");
  cy.visit(`${baseUrl}/#/`);
  cy.get('[data-cy="nav-link-login"]').click();
  cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
  cy.get('[data-cy="login-input-password"]').type("testtest");
  cy.get('[data-cy="login-submit"]').click();
  cy.get('[data-cy="nav-link-logout"]').should("exist");
});

Cypress.Commands.add("visitProduct", (id) => {
  const baseUrl = Cypress.config("baseUrl");
  cy.visit(`${baseUrl}/#/products/${id}`);
});

Cypress.Commands.add("goToHome", () => {
  const baseUrl = Cypress.config("baseUrl");
  cy.visit(`${baseUrl}/#/`);
});

Cypress.Commands.add("goToProducts", () => {
  cy.goToHome();
  cy.contains("Voir les produits").click();
});

// Commande API pour login
Cypress.Commands.add(
  "loginByAPI",
  (username = "test2@test.fr", password = "testtest") => {
    return cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: { username, password },
      failOnStatusCode: false,
    });
  }
);

// Stocke le token d'authentification
Cypress.Commands.add("storeAuthToken", () => {
  return cy.loginByAPI().then((response) => {
    expect(response.status).to.eq(200);
    Cypress.env("authToken", response.body.token);
  });
});

// Ajoute un produit au panier via l'API
Cypress.Commands.add("addToCartAPI", (token, productId, quantity = 1) => {
  return cy.request({
    method: "PUT",
    url: "http://localhost:8081/orders/add",
    failOnStatusCode: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      product: productId,
      quantity,
    },
  });
});

// Récupère le panier sans authentification
Cypress.Commands.add("getCartWithoutAuth", () => {
  return cy.request({
    method: "GET",
    url: "http://localhost:8081/orders",
    failOnStatusCode: false,
  });
});

// Récupère un produit par son ID
Cypress.Commands.add("getProductById", (id) => {
  return cy.request(`http://localhost:8081/products/${id}`);
});

// Récupère le panier avec authentification
Cypress.Commands.add("getCartAPI", (token) => {
  return cy.request({
    method: "GET",
    url: "http://localhost:8081/orders",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});

// Récupère un produit disponible (stock > 1)
Cypress.Commands.add("getAvailableProduct", () => {
  return cy.request("http://localhost:8081/products").then((response) => {
    expect(response.status).to.eq(200);
    const produitsDisponibles = response.body.filter(
      (p) => p.availableStock > 1
    );
    expect(produitsDisponibles.length).to.be.greaterThan(0);
    return produitsDisponibles[0];
  });
});






/**
 * Réinitialise complètement le panier via l'API
 */


// Récupère le panier avec authentification
Cypress.Commands.add("removeFromCartAPI", (token, id) => {
  return cy.request({
    method: "DELETE",
    url: `http://localhost:8081/orders/${id}/delete`, 
    failOnStatusCode: false, // On gère les erreurs manuellement
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});
Cypress.Commands.add("resetCart", () => {
  cy.storeAuthToken();

  cy.then(() => {
    const authToken = Cypress.env("authToken");

    // Récupération du panier
    cy.getCartAPI(authToken).then((response) => {
      const orderLines = response.body.orderLines;

      // Si le panier est déjà vide, on sort
      if (!orderLines || orderLines.length === 0) {
        cy.log("Panier déjà vide");
        return;
      }

      // Suppression de chaque ligne du panier
      orderLines.forEach((line) => {
        cy.removeFromCartAPI(authToken, line.id);
      });

      cy.log("Panier réinitialisé");
    });
  });
});
