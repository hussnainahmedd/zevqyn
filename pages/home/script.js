/**
 * ZEVQYN V1.1 Home Interaction Script
 * Scope: Subtle desktop-only hero depth & smooth interactions
 * Safety: No external libraries, prefers-reduced-motion respected, zero logical ampersands
 */
(function () {
  'use strict';

  function initHomeInteractions() {
    // 1. Accessibility guard: disable all interactive motion if user prefers reduced motion
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      return;
    }

    // 2. Device guard: only run on devices with fine pointer (mouse / trackpad)
    var hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!hoverQuery.matches) {
      return;
    }

    // 3. Subtle Hero Visual Pointer Parallax (Restrained to max 2 degrees)
    var heroFrame = document.querySelector('.zev-hero-preview-frame');
    var heroVisual = document.querySelector('.zev-hero-visual');

    if (heroVisual) {
      if (heroFrame) {
        var isHovered = false;
        var rafId = null;
        var targetRotateX = 0;
        var targetRotateY = 0;
        var currentRotateX = 0;
        var currentRotateY = 0;

        function updateTransform() {
          // Gentle linear interpolation for silky smooth spring damping
          currentRotateX += (targetRotateX - currentRotateX) * 0.1;
          currentRotateY += (targetRotateY - currentRotateY) * 0.1;

          heroFrame.style.transform = 'perspective(1000px) rotateX(' + currentRotateX.toFixed(2) + 'deg) rotateY(' + currentRotateY.toFixed(2) + 'deg)';

          var diffX = Math.abs(targetRotateX - currentRotateX);
          var diffY = Math.abs(targetRotateY - currentRotateY);

          // Continue loop only when actively moving
          var shouldContinue = false;
          if (isHovered) {
            shouldContinue = true;
          } else if (diffX > 0.01) {
            shouldContinue = true;
          } else if (diffY > 0.01) {
            shouldContinue = true;
          }

          if (shouldContinue) {
            rafId = requestAnimationFrame(updateTransform);
          } else {
            heroFrame.style.transform = 'none';
            rafId = null;
          }
        }

        heroVisual.addEventListener('mouseenter', function () {
          isHovered = true;
          if (!rafId) {
            rafId = requestAnimationFrame(updateTransform);
          }
        });

        heroVisual.addEventListener('mousemove', function (e) {
          var rect = heroVisual.getBoundingClientRect();
          var width = rect.width;
          var height = rect.height;

          if (width > 0) {
            if (height > 0) {
              var mouseX = e.clientX - rect.left;
              var mouseY = e.clientY - rect.top;

              var normX = (mouseX / width) - 0.5;
              var normY = (mouseY / height) - 0.5;

              // Restrained tilt: maximum +/- 2 degrees
              targetRotateY = normX * 3.5;
              targetRotateX = -normY * 3.5;

              if (!rafId) {
                rafId = requestAnimationFrame(updateTransform);
              }
            }
          }
        });

        heroVisual.addEventListener('mouseleave', function () {
          isHovered = false;
          targetRotateX = 0;
          targetRotateY = 0;
        });
      }
    }
  }

  // Safe DOM ready initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeInteractions);
  } else {
    initHomeInteractions();
  }
})();
