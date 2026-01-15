describe("API – Authentification utilisateur", () => {

  it("Doit retourner 200 pour un utilisateur existant et fournir un token", () => {
    cy.loginByAPI().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
    });
  });

  it("Doit retourner 401 pour un utilisateur inconnu", () => {
    cy.loginByAPI("faux@test.fr", "mdpfaux").then((response) => {
      expect(response.status).to.eq(401);
    });
  });

});
