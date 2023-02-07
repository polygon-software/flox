export default `
<div style="padding: 10px">
  <h3>
    {{@if(it.lang === "de")}}
    Passwort zurückgesetzt
    {{#else}}
    Password reset
    {{/if}}
  </h3>
  <p>
    <!-- DE -->
    {{@if(it.lang === "de")}}
    Ihr Passwort wurde zurückgesetzt. Ihr Temporär-Passwort lautet:
     <br/>
     <br/>
     {{it.password}}
     <br/>
     <br/>
     Sie werden beim nächsten Login gebeten werden, Ihr Passwort zu ändern.
    {{#else}}
    <!-- EN -->
      Your password has been reset. Your temporary password is:
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
