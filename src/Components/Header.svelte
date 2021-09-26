<script>
  import { username, user } from "../user";

  function signout() {
    user.leave();
    username.set();
  }
</script>

{#if $username}
  <div class="user-bio">
    <span>
      Hello <strong>$username</strong>
    </span>
  </div>
  <button class="signout-button" on:click={signout}>Sign Out</button>
{:else}
  <div class="d-flex justify-content-end align-items-center">
    <img src="images/icon.png" id="logo" alt="um" />
    <a id="logo-text">Voidforge</a>
  </div>
{/if}
