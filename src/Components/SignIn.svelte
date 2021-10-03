<script>
  import { user } from "../user.js";

  let username;
  let password;

  function login() {
    user.auth(username, password, ({ err }) => err && alert(err));
  }

  function signup() {
    user.create(username, password, ({ err }) => {
      if (err) {
        alert(err);
      } else {
        login();
      }
    });
  }
</script>

<div
  id="signinmodal"
  class="modal fade"
  tabindex="-1"
  aria-labelledby="signinModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        Sign-In/Sign-Up
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div class="modal-body">
        <div class="mb-2">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            class="form-control"
            bind:value={username}
            minlength="3"
            maxlength="16"
          />
        </div>
        <div class="mb-2">
          <label for="password" class="form-label">Password</label>
          <input id="password" class="form-control" bind:value={password} type="password" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" on:click={login}>
          Sign-In
        </button>
        <button type="button" class="btn btn-primary" on:click={signup}>
          Sign-Up
        </button>
      </div>
    </div>
  </div>
</div>
