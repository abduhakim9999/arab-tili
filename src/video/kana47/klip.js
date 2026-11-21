(function () { var sc = function (id) { return TL.scenes.find(function (s) { return s.id === id; }).s; };
  window.KLIP = [{ id: 'k1', s: 0, e: sc('S2') + .9, n: 331, fps: 30 }, { id: 'k1', s: sc('S9') - .7, e: sc('S10') + .8, n: 331, fps: 30, rate: .5, pp: 1 }]; })();
