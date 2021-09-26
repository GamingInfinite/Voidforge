<script>
  import { username, user } from "../user";

  function signout() {
    user.leave();
    username.set();
  }
</script>

{#if $username}
  <div
    class="d-flex justify-content-end align-items-center py-1 pe-4 fs-4"
    id="header"
  >
    <span>
      Hello <strong>$username</strong>
    </span>
    <button class="signout-button" on:click={signout}>Sign Out</button>
    <img src="images/icon.png" id="logo" alt="um" />
    Voidforge
  </div>
{:else}
  <div
    class="d-flex justify-content-end align-items-center py-1 pe-4 fs-4"
    id="header"
  >
    <button class="signin-button btn btn-primary" data-bs-toggle="modal" data-bs-target="#signinmodal">Sign In</button>
    <img src="images/icon.png" id="logo" alt="um" />
    Voidforge
  </div>
{/if}
