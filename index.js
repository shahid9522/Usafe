// Initialization code
document.addEventListener("init", function (event) {
  var page = event.target;

  if (page.id == "page1") {
    page.querySelector("#push-button").onclick = function () {
      document
        .querySelector("#myNavigator")
        .pushPage("page2.html", { data: { title: "Page 2" } });
    };
  } else if (page.id == "page2") {
    const card = page.querySelectorAll(".card");
    for (let i = 0; i < card.length; i++) {
      card[i].addEventListener("click", function () {
        document
          .querySelector("#myNavigator")
          .pushPage("page3.html", { data: { title: "Page 3" } });
      });
    }
  }
});

function popPageCustom() {
  document.querySelector("#myNavigator").popPage();
}
