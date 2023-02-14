/**
 * Template for invitation e-mails
 * see https://squirrelly.js.org/docs/syntax/overview for variable/condition syntax
 */

export default `
<div style="padding: 10px">
  <h3>
    {{@if(it.lang === "de")}}
    Willkommen bei Flox
    {{#else}}
    Welcome to Flox
    {{/if}}
  </h3>
  <p>
    <!-- DE -->
    {{@if(it.lang === "de")}}
    Ihr Temporär-Passwort lautet:
     <br/>
     <br/>
     {{it.password}}
     <br/>
     <br/>
     Sie werden beim nächsten Login gebeten werden, Ihr Passwort zu ändern.
    {{#else}}
    <!-- EN -->
      Your temporary password is:
      <br/>
      <br/>
      {{it.password}}
      <br/>
      <br/>
      You will be prompted to change it at the next login.
    {{/if}}
  </p>
</div>
`;
