var ready = function(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading') {
        fn();
      }
    });
  }

  return;
};

/**
 * If loaded DOM elements
 **/
ready(function() {
  var cookiebar = new Cookiebar({
    debug: 1,
    content: {
      description: "Acest site folosește cookies. Prin continuarea utilizării site-ului, vă exprimați acordul cu privire la modulele noastre cookie.",
      link: "",
      href: "#",
      button: "Am inteles!",
    },
    onAccept: function () {
    }
  });

  


let xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/feleecor/cookiesjs/main/policy.pol');
xhr.send();

xhr.onload = function() {
	var myDiv = document.createElement("div");

//Set its unique ID.
myDiv.id = 'cl_modal';

//Add your content to the DIV
myDiv.innerHTML = xhr.response;

//Finally, append the element to the HTML body
document.body.appendChild(myDiv);

const openEl = document.getElementsByClassName("open-ck-modal")[0];
const closeEl = document.getElementsByClassName("close-ck-modal")[0];
const isVisible = "is-visible";

openEl.addEventListener("click", function(e) {
    document.getElementById('ckModal').classList.add(isVisible);
}, false);

closeEl.addEventListener("click", function(e) {
    document.getElementById('ckModal').classList.remove(isVisible);
}, false);
document.addEventListener("click", e => {
  if (e.target == document.querySelector(".clmodal.is-visible")) {
    document.querySelector(".clmodal.is-visible").classList.remove(isVisible);
  }
});

document.addEventListener("keyup", e => {
  // if we press the ESC
  if (e.key == "Escape" && document.querySelector(".clmodal.is-visible")) {
    document.querySelector(".clmodal.is-visible").classList.remove(isVisible);
  }
});
};


});



