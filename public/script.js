const form = document.querySelector("#formSubmit");

  form.addEventListener("submit", (e) => {
  e.preventDefault();
  const itemData = new FormData(form);
  const reqBody = Object.fromEntries(itemData);
  console.log(reqBody);

  fetch("/appointment", {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  .then((data) => {
    console.log(data)
     window.location.reload()
  })
});
