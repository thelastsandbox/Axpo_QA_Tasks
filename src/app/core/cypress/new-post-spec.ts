/// <reference types="Cypress" />

import { stripIndent } from "common-tags";

const title = "Proles gravi uni";
const about = "Lorem markdownum actum Phoeboque formae";
const tags = ["random", "latin", "post"];
const article = stripIndent;

describe("New post", () => {
  beforeEach(() => {
    cy.task("cleanDatabase");
    cy.registerUserIfNeeded();
    cy.login();
  });

  it("writes a post", () => {
    // I have added "data-cy" attributes
    // following Cypress best practices
    // https://on.cypress.io/best-practices#Selecting-Elements
    cy.get("[data-cy=new-post]").click();

    cy.get("[data-cy=title]").type("my title");
    cy.get("[data-cy=about]").type("about X");
    cy.get("[data-cy=article]").type("this post is **important**.");
    cy.get("[data-cy=tags]").type("test{enter}");
    cy.get("[data-cy=publish]").click();

    // changed url means the post was successfully created
    cy.location("pathname").should("equal", "/article/my-title");
  });

  it("can edit an article", () => {
    cy.contains("a.nav-link", "New Post").click();

    // I have added "data-cy" attributes to select input fields
    cy.get("[data-cy=title]").type("my title");
    cy.get("[data-cy=about]").type("about X");
    cy.get("[data-cy=article]").type("this post is **important**.");
    cy.get("[data-cy=tags]").type("test{enter}");
    cy.get("[data-cy=publish]").click();
    cy.location("pathname").should("equal", "/article/my-title");

    cy.get("[data-cy=edit-article]").click();
    cy.location("pathname").should("equal", "/editor/my-title");
    cy.get("[data-cy=title]").clear().type("a brand new title");
    cy.get("[data-cy=publish]").click();
    cy.location("pathname").should("equal", "/article/a-brand-new-title");
  });

  it("can fav and unfav an article", () => {
    cy.contains("a.nav-link", "New Post").click();

    // I have added "data-cy" attributes to select input fields
    cy.get("[data-cy=title]").type("my title");
    cy.get("[data-cy=about]").type("about X");
    cy.get("[data-cy=article]").type("this post is **important**.");
    cy.get("[data-cy=tags]").type("test{enter}");
    cy.get("[data-cy=publish]").click();
    // wait for the article to be published
    // otherwise if we just click on the profile link right away
    // we might load profile - THEN immediately load the article
    // because we clicked on it first
    cy.location("pathname").should("equal", "/article/my-title");

    cy.get("[data-cy=home]").click();
    cy.get("[data-cy=global-feed]").click();
    cy.get(".article-preview")
      .should("have.length", 1)
      .first()
      .find("[data-cy=fav-article]")
      .click();

    // now go to my profile and see this article
    cy.get("[data-cy=profile]").click();
    cy.location("pathname").should("equal", "/@testuser");
    cy.contains(".article-preview", "my title")
      // now unfav article
      .find("[data-cy=fav-article]")
      .click();
  });

  it("sets tags", () => {
    cy.contains("a.nav-link", "New Post").click();

    // I have added "data-cy" attributes to select input fields
    cy.get("[data-cy=title]").type("my title");
    cy.get("[data-cy=about]").type("about X");
    cy.get("[data-cy=article]").type("this post is **important**.");

    const tags = ["code", "testing", "cypress.io"];
    cy.get("[data-cy=tags]").type(tags.join("{enter}") + "{enter}");
    cy.get("[data-cy=publish]").click();

    // check that each tag is displayed after post is shown
    cy.url().should("match", /my-title$/);
    tags.forEach((tag) => cy.contains(".tag-default", tag));
  });

  it("sets the post body at once", () => {
    cy.contains("a.nav-link", "New Post").click();

    // I have added "data-cy" attributes to select input fields
    cy.get("[data-cy=title]").type("my title");
    cy.get("[data-cy=about]").type("about X");

    // to speed up creating the post, set the text as value
    // and then trigger change event by typing "Enter"
    const post = stripIndent`
      # Fast tests

      > Speed up your tests using direct access to DOM elements

      You can set long text all at once and then trigger \`onChange\` event.
    `;

    cy.get("[data-cy=article]").invoke("val", post).type("{enter}");

    cy.get("[data-cy=tags]").type("test{enter}");
    cy.get("[data-cy=publish]").click();

    cy.contains("h1", "my title");
  });

  it("adds a new post", () => {
    cy.contains("a.nav-link", "New Post").click();

    // instead hard-coding text in this test
    // the blog post contents comes from cypress/fixtures/post.js
    cy.get("[data-cy=title]").type(title);
    cy.get("[data-cy=about]").type(about);

    // typing entire post as a human user takes too long
    // just set it at once!

    // instead of
    // cy.get('[data-cy=article]').type(article)

    // dispatch Redux actions
    cy.window().its("store").invoke("dispatch", {
      type: "UPDATE_FIELD_EDITOR",
      key: "body",
      value: article,
    });

    // need to click "Enter" after each tag
    cy.get("[data-cy=tags]").type(tags.join("{enter}") + "{enter}");

    // and post the new article
    cy.get("[data-cy=publish]").click();

    // the url should show the new article
    cy.url().should("include", "/article/" + Cypress._.kebabCase(title));

    // new article should be on the server
    cy.request("http://localhost:3000/api/articles?limit=10&offset=0")
      .its("body")
      .should((body) => {
        expect(body).to.have.property("articlesCount", 1);
        expect(body.articles).to.have.length(1);
        const firstPost = body.articles[0];
        expect(firstPost).to.contain({
          title,
          description: about,
          body: article,
        });
        expect(firstPost.tagList).to.be.an("array");
        const sortedTags = firstPost.tagList.sort();
        expect(sortedTags).to.deep.equal(tags.sort());
      });
  });

  it("deletes post", () => {
    cy.contains("a.nav-link", "New Post").click();

    // instead hard-coding text in this test
    // the blog post contents comes from cypress/fixtures/post.js
    cy.get("[data-cy=title]").type(title);
    cy.get("[data-cy=about]").type(about);

    // dispatch Redux actions
    cy.window().its("store").invoke("dispatch", {
      type: "UPDATE_FIELD_EDITOR",
      key: "body",
      value: article,
    });

    // need to click "Enter" after each tag
    cy.get("[data-cy=tags]").type(tags.join("{enter}") + "{enter}");

    // and post the new article
    cy.get("[data-cy=publish]").click();

    // the url should show the new article
    cy.url().should("include", "/article/" + Cypress._.kebabCase(title));

    cy.get("[data-cy=delete-article]").click();

    // goes back to the main page
    cy.location("pathname").should("equal", "/");
  });

  it("creates article using API", () => {
    cy.postArticle({
      title: "first post",
      description: "first description",
      body: "first article",
      tagList: ["first", "testing"],
    });
  });
});
