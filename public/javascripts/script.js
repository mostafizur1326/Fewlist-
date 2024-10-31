const textarea = document.querySelector("#textarea");

textarea.addEventListener("keyup", (e) =>{
  let scrollHeight = e.target.scrollHeight;
  textarea.style.height = `${scrollHeight}px`;
})
