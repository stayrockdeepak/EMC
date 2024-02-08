"use strict";

(function () {
  if (typeof window.IVD === "undefined") {
    window.IVD = {};
    IVD.mode = window.herolens ? "Herolens" : window.location.href.indexOf("file:") == 0 ? "Local" : "Innovid";
    populateIVD();
  } else {
    populateIVD();
    Object.defineProperty(window, 'IVD', {
      writable: false
    });
  } ////////////// Define PIE Utils Interface


  function populateIVD() {
    console.log("Using Innovid GWD Connector (version: 0.6.1)");
    var cssCodes = {
      "v": "visibility",
      "w": "width",
      "h": "height",
      "t": "top",
      "l": "left",
      "fs": "fontSize",
      "lh": "lineHeight",
      "ls": "letterSpacing"
    };

    function toArray(htmlCollection) {
      return Array.prototype.slice.call(htmlCollection);
    }

    IVD.injectText = function (whatText) {
      var broken = whatText.split(/\|\||\|\|/g);

      if (broken.length > 0) {
        for (var b = 1; b < broken.length; b = b + 2) {
          if (IVD.feed.hasOwnProperty(broken[b])) {
            broken[b] = IVD.feed[broken[b]];
          } else {
            broken[b] = "||" + broken[b] + "||";
          }
        }
      }

      whatText = broken.join("");
      var broken = whatText.split(/{{|}}/g);

      if (broken.length > 0) {
        for (var b = 1; b < broken.length; b = b + 2) {
          if (IVD.ctx.hasOwnProperty(broken[b])) {
            broken[b] = IVD.ctx[broken[b]];
          } else {
            broken[b] = "{{" + broken[b] + "}}";
          }
        }
      }

      whatText = broken.join("");
      return whatText;
    };

    var dataPopulated = false;

    IVD.populateDynamicData = function () {
      if (dataPopulated) return;
      dataPopulated = true;
      var ivcAdSize = parseInt(document.getElementsByTagName("gwd-page")[0].dataset.gwdWidth) + "_" + parseInt(document.getElementsByTagName("gwd-page")[0].dataset.gwdHeight);

      for (var property in IVD.feed) {
        if (IVD.feed.hasOwnProperty(property)) {
          var adSizeApendix = "___" + ivcAdSize; //var perSizeExists = new RegExp(adSizeApendix+"$").test(property);

          var perSizeExists = new RegExp(adSizeApendix).test(property);

          if (perSizeExists) {
            IVD.feed[property.split("___")[0]] = IVD.feed[property];
          }
        }
      }

      for (var property in IVD.feed) {
        if (IVD.feed.hasOwnProperty(property)) {
          var propertyForSizes = property.split("___");

          if (propertyForSizes[1]) {
            var sizes = propertyForSizes[1].split("_");

            if (sizes[0] && sizes[1] && !isNaN(sizes[0]) && !isNaN(sizes[1])) {
              delete IVD.feed[property];
            }
          }
        }
      } // creative control


      for (var key in IVD.feed) {
        if (IVD.feed.hasOwnProperty(key) && key.substring(0, 3) == "iv_") {
          var elements = [window.document.getElementById(key)];
          elements = elements.concat(toArray(window.document.querySelectorAll('[data-gwd-grp-id="' + key + '"]')));

          for (var e = 0; e < elements.length; e++) {
            var element = elements[e];

            if (element) {
              if (element.tagName.toLowerCase() == 'gwd-image') {
                element.setAttribute("source", IVD.feed[key]);
              }

              if (['p', 'span', 'h1', 'h2', 'h3', 'strong', 'em', 'q', 'sup', 'sub'].indexOf(element.tagName.toLowerCase()) != -1) {
                var feedText = IVD.decodeHTML(IVD.feed[key]);
                var seperators = ["<span.*?>", "<\/span>", "<b>", "<\/b>", "<em>", "<\/em>", "<i>", "<\/i>", "<small>", "<\/small>", "<strong>", "<\/strong>", "<sub>", "<\/sub>", "<sup>", "<\/sup>", "<ins>", "<\/ins>", "<del>", "<\/del>", "<mark>", "<\/mark>", "<br>"];
                var newElementTags = feedText.match(new RegExp(seperators.join("|"), "g"));
                var texts = feedText.split(new RegExp(seperators.join("|"), "g"));
                var newElements = [];
                var first = document.createElement("span");
                first.textContent = texts[0];
                newElements.push(first);

                for (var t = 1; t < texts.length; t++) {
                  var naked = newElementTags[t - 1].split("<").join("").split(">").join("");
                  var spanStyle = "";

                  if (naked.substring(0, 4) == "span") {
                    spanStyle = naked.split('"');
                    if (spanStyle.length == 1) spanStyle = naked.split("'");

                    if (spanStyle.length > 1) {
                      spanStyle = spanStyle[1];
                    } else {
                      spanStyle = "";
                    }

                    naked = "span";
                  }

                  if (naked == "br") {
                    newElements.push(document.createElement("br"));
                    naked = t == texts.length - 1 && texts.length > 2 ? "" : "span";
                  }

                  if (naked.substr(0, 1) == "/") naked = "span";

                  if (naked) {
                    var ne = document.createElement(naked);
                    if (spanStyle) ne.style = spanStyle;
                    ne.textContent = texts[t];
                    newElements.push(ne);
                  }
                }

                element.textContent = "";

                for (var neta = 0; neta < newElements.length; neta++) {
                  element.append(newElements[neta]);
                }
              }

              if (element.tagName.toLowerCase() == 'gwd-video') {
                element.setAttribute("sources", IVD.feed[key]);
              }
            }
          }

          var keySplit = key.split("_");

          if (keySplit.length > 2 && keySplit[0] == "iv" && cssCodes[keySplit[1]]) {
            var elId = "iv_" + keySplit.slice(2).join("_");
            var elementsToEdit = [window.document.getElementById(elId)];
            elementsToEdit = elementsToEdit.concat(toArray(window.document.querySelectorAll('[data-gwd-grp-id="' + elId + '"]')));

            for (var ele = 0; ele < elementsToEdit.length; ele++) {
              var elementToEdit = elementsToEdit[ele];

              if (elementToEdit) {
                var cssProp = cssCodes[keySplit[1]];
                var cssValue = IVD.feed[key];
                var deltaOp = cssValue.substring(0, 1); // if the value is a pixel delta value

                if (deltaOp == "+" || deltaOp == "-") {
                  cssValue = parseFloat(cssValue.substring(1));
                  var currentValue = parseFloat(window.getComputedStyle(elementToEdit)[cssProp]);
                  elementToEdit.style[cssProp] = (deltaOp == "+" ? currentValue + cssValue : currentValue - cssValue).toString() + "px";
                } else {
                  // only for numeric values without a length unit
                  if (parseFloat(cssValue).toString() === cssValue) {
                    cssValue += "px";
                  }

                  elementToEdit.style[cssProp] = cssValue;
                }
              }
            }
          }
        }
      } // handle clickthrus

      /*var tapAreas = toArray(document.getElementsByTagName("gwd-taparea"));
      tapAreas.forEach(function(ta){
          var taid = ta.id;
          if (!taid) taid = ta.getAttribute("data-gwd-grp-id");
          if (taid.substring(0,3) != "ct_") return;
          taid = taid.substring(3);
          var feedURL = undefined;
          if (IVD.feed[taid]) {
              feedURL = IVD.feed[taid];
          }
          ta.addEventListener("action", function(){IVD.clickthru(taid,feedURL)});
      });*/

    };

    IVD.decodeHTML = function (whatText) {
      if (!whatText) return "";
      return whatText.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    };

    IVD.startIVD_GWD = function (isInteractive, shouldAlertInteractions, shouldUseMockFeed) {
      if (IVD.mode == "Local" && document.querySelector('meta[name="environment"]').content != "gwd-genericad") {
        alert("Innovid Ad: Please change Ad Environment to 'Non-Google Ad'");
        return;
      }

      if (IVD && IVD.mode == "Local" && shouldUseMockFeed) {
        for (var key in window.gwd_mock_feed) {
          window.gwd_mock_feed[key] = window.gwd_mock_feed[key].toString();
        }

        IVD.feed = window.gwd_mock_feed;
      }

      IVD.populateDynamicData();

      if (isInteractive) {
        IVD.enableInteractions();
      } else {
        if (IVD.mode == "Local") {
          var body = document.getElementsByTagName("body")[0];
          var blocker = document.createElement("div");
          blocker.id = "ivd_gwd_local_blocker";
          blocker.style.position = "absolute";
          blocker.style.top = blocker.style.left = blocker.style.bottom = blocker.style.right = "0px";
          blocker.style.width = "100%";
          blocker.style.height = "100%";
          blocker.style.zIndex = 999999;
          body.appendChild(blocker);
          blocker.addEventListener('click', function () {
            if (shouldAlertInteractions) {
              alert("\n(PLATFORM CLICK-THROUGH)");
            }
          });
        }
      }

      var politeImage = document.getElementById("polite_image");

      if (politeImage && IVD.mode == "Innovid") {
        politeImage.remove();
        var pages = toArray(document.getElementsByTagName("gwd-page"));

        for (var p = 0; p < pages.length; p++) {
          pages[0].style.backgroundColor = "rgba(0,0,0,0);";
        }
      }

      var videos = toArray(document.getElementsByTagName("gwd-video"));
      var quartiles = {};

      for (var v = videos.length - 1; v > -1; v--) {
        if (videos[v].id.substring(0, 3) != "iv_") {
          videos.splice(v, 1);
        }
      }

      if (videos.length > 0) {
        loop();
      }

      function loop() {
        videos.forEach(function (video) {
          for (var i = 1; i < 5; i++) {
            if (video.currentTime / video.duration >= 0.25 * i && !quartiles[video.id + i.toString()]) {
              quartiles[video.id + i.toString()] = true;
              IVD.report(video.id + "_" + 25 * i + "%");
            }
          }
        });
        requestAnimationFrame(loop);
      }

      ;
      /* MANUAL CODE - DO NOT DELETE THIS COMMENT */

      /* MANUAL CODE - DO NOT DELETE THIS COMMENT */
    };
  }
})();