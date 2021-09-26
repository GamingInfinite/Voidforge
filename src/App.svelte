<script lang="ts">
  import Header from "./Components/Header.svelte";
  import Footer from "./Components/Footer.svelte";
  import Draggable from "./Components/Draggable.svelte";
</script>

<div class="app">
  <div class="row">
    <div class="col">
      <Header />
    </div>
  </div>
  <Draggable>
    <div class="container" id="ChatWindow">
      <div class="row" id="ChatHeader">
        <div class="col">
          <div class="d-flex justify-content-center p-2 fs-2">
            Mod Discussion
          </div>
        </div>
      </div>
      <div class="row" id="Chat">
        <div class="col">
          <div class="d-flex justify-content-center p-2 fs-5">Test</div>
        </div>
      </div>
    </div>
  </Draggable>
  <Footer />
</div>
