<script>
  import Login from "./Login.svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import { onMount } from "svelte";
  import { username, user } from "./user";
  import debounce from "lodash.debounce";

  import GUN from "gun";
  import Gun from "gun";
  const db = GUN();

  let newMessage;
  let messages = [];

  let scrollBottom;
  let lastScrollTop;
  let canAutoScroll = true;
  let unreadMessages = false;

  function autoScroll() {
    setTimeout(() => {
      scrollBottom?.scrollIntoView({ behavior: "auto" });
    }, 50);
    unreadMessages;
  }

  function watchScroll(e) {
    canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
    lastScrollTop = e.target.scrollTop;
  }

  $: debounceWatchScroll = debounce(watchScroll, 1000);

  onMount(() => {
    var match = {
      ".": {
        ">": new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(),
      },
      "-": 1,
    };

    db.get("chat")
      .map(match)
      .once(async (data, id) => {
        if (data) {
          const key = "#3Gr0fD!0V";

          var message = {
            who: await db.user(data).get("alias"),
            what: (await SEA.decrypt(data.what, key)) + "",
            when: GUN.state.is(data, "what"),
          };

          if (message.what) {
            messages = [...messages.slice(-100), message].sort(
              (a, b) => a.when - b.when
            );
            if (canAutoScroll) {
              autoScroll();
            } else {
              unreadMessages = true;
            }
          }
        }
      });
  });

  async function sendMessage() {
    const secret = await SEA.encrypt(newMessage, "#3Gr0fD!0V");
    const message = user.get("all").set({ what: secret });
    const index = new Date().toISOString;
    db.get("chat").get(index).put(message);
    newMessage = "";
    canAutoScroll = true;
    autoScroll();
  }
</script>
