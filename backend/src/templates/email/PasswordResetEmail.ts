/**
 * Template for password reset e-mails
 * see https://squirrelly.js.org/docs/syntax/overview for variable/condition syntax
 */

export default {
  de: `
<div style="padding: 10px">
  <h3>
    Passwort zurückgesetzt
  </h3>
  <p>
    Ihr Passwort wurde zurückgesetzt. Ihr Temporär-Passwort lautet:
    <br/>
    <br/>
    {{it.password}}
    <br/>
    <br/>
    Sie werden beim nächsten Login gebeten werden, Ihr Passwort zu ändern.
  </p>
</div>
`,
  en: `
<div style="padding: 10px">
  <h3>
    Password reset
  </h3>
  <p>
    Your password has been reset. Your temporary password is:
    <br/>
    <br/>
    {{it.password}}
    <br/>
    <br/>
    You will be prompted to change it at the next login.
  </p>
</div>
`,
} as { [key: string]: string };
