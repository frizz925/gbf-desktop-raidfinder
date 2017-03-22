var result = [];
var els = document.querySelectorAll("[data-bossname] span.mdl-list__item-primary-content");
for (var i = 0; i < els.length; i++) {
  var el = els[i];
  var spans = el.querySelectorAll("span");
  result.push({
    jp: spans[0].innerText,
    en: spans[1].innerText
  });
}
console.log(JSON.stringify(result, null, 2));