declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<any>;
    getLoginToken(user: any): Chainable<any>;
    registerUserIfNeeded(): Chainable<any>;
    dispatch(action: any): Chainable<any>;
    article(field: any): Chainable<any>;
    postArticle(fields: any): Chainable<any>;
    writeArticle(field: any): Chainable<any>;
    postComment(articleSlug: any, text: any): Chainable<any>;
  }
}
