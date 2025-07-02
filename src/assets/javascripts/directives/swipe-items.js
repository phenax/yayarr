Vue.directive('swipe-items', {
  inserted(el, _, vnode) {
    if (!window.Hammer) return;
    delete Hammer.defaults.cssProps.userSelect; // Allow selection
    const hammer = new Hammer.Manager(el, {
      domEvents: true,
      touchAction: 'auto',
      inputClass: Hammer.TouchInput,
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_HORIZONTAL,
          threshold: 50,
          velocity: 1,
        }]
      ]
    });
    hammer.on('swipeleft', (_) => {
      vnode.context.navigateToItem(+1)
    })
    hammer.on('swiperight', (_) => {
      vnode.context.navigateToItem(-1)
    })
  }
})
