(function () {
  var result = [];
  $(".wikitable tbody tr:not(:first-child)").each(function () {
    var $el = $(this);
    var columns = $("td", $el);
    if (columns.length != 2) return;
    result.push({
      jp: columns.eq(0).text().trim(),
      en: columns.eq(1).text().trim()
    });
  });
  console.log(JSON.stringify(result, null, 2));
})();