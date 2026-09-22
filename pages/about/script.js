/**
 * ZEVQYN V1.1 About Interaction Script
 * Scope: Subtle desktop tilt and IntersectionObserver reveals
 * Safety: Reduced motion respected, touch safe, zero '&&' operators
 */
function zevqynAboutInitialize() {
  'use strict';

  var revealItems = document.querySelectorAll('.za-reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('za-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('za-visible');
    });
  }

  // Motion guard: respect user reduced motion preference
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    return;
  }

  // Pointer guard: only run tilt on mouse / trackpad devices
  var hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!hoverQuery.matches) {
    return;
  }

  var visual = document.querySelector('.za-visual');

  if (visual) {
    visual.addEventListener('mousemove', function (event) {
      if (window.innerWidth <= 1024) {
        return;
      }

      var rect = visual.getBoundingClientRect();
      var mouseX = event.clientX - rect.left;
      var mouseY = event.clientY - rect.top;

      var rotateY = ((mouseX / rect.width) - 0.5) * 2.5;
      var rotateX = ((mouseY / rect.height) - 0.5) * -2.5;

      visual.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
    });

    visual.addEventListener('mouseleave', function () {
      visual.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    zevqynAboutInitialize();
  });
} else {
  zevqynAboutInitialize();
}
