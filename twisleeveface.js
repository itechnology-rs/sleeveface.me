(function(doc, win, nav) {
  var arrayer = Array().slice,
      video = doc.querySelector('video'),
      canvasHeader = doc.querySelector('#canvas-header'),
      canvasPhoto = doc.querySelector('#canvas-photo'),
      preview = doc.querySelector('#preview img'),
      header = doc.querySelector('#header img'),
      photo = doc.querySelector('#photo img'),
      timer = doc.querySelector('#timer'),
      handle = doc.querySelector('#handle'),
      fullname = arrayer.call(doc.querySelectorAll('.fullname')),
      username = arrayer.call(doc.querySelectorAll('.username')),
      bio = arrayer.call(doc.querySelectorAll('.bio')),
      loc = arrayer.call(doc.querySelectorAll('.location')),
      place = doc.querySelector('script'),
      linkHeader = doc.querySelector('#header a'),
      linkPhoto = doc.querySelector('#photo a'),
      ctxHeader = canvasHeader.getContext('2d');
      ctxPhoto = canvasPhoto.getContext('2d');

  function snapshot() {
    ctxHeader.drawImage(video, 0, 0, 520, 260, 0, 0, 520, 260);
    preview.src = header.src = canvasHeader.toDataURL('image/jpeg');
    linkHeader.href = header.src.replace('image/jpeg', 'image/octet-stream');

    ctxPhoto.drawImage(video, 224, 24, 73, 73, 0, 0, 73, 73);
    photo.src = canvasPhoto.toDataURL('image/jpeg');
    linkPhoto.href = photo.src.replace('image/jpeg', 'image/octet-stream');
  }

  function timed() {
    var count = 5;

    function rec() {
      if (count === 0) {
        snapshot();
        timer.innerHTML = '&nbsp;';
        timer.disabled = false;
      } else {
        timer.innerHTML = count;
        count -= 1;
        setTimeout(rec, 1000);
      }
    }

    timer.disabled = true;
    rec();
  }

  function getUser(e) {
    var script = doc.createElement('script'),
        screenName = handle.value;

    e.preventDefault();

    script.className = 'api';
    script.src = 'https://api.twitter.com/1/users/show.json?' +       
      'callback=cb&screen_name=' + screenName;
    place.parentNode.insertBefore(script, place);
  }

  function set(els, value) {
    els.forEach(function(el) {
      el.innerHTML = value || '';
    });
  }

  win.cb = function(data) {
    var locUrl,
        scripts = arrayer.call(doc.querySelectorAll('.api'));

    if (data) {
      set(fullname, data.name);
      set(username, '@' + data.screen_name);
      set(bio, data.description);
      locUrl = data.location || '';
      if (data.url) {
        if (locUrl) {
          locUrl += ' · ';
        }
        locUrl += data.url.replace(/^https?:\/\//, '');
      }
      set(loc, locUrl);
    }

    scripts.forEach(function eachScript(script) {
      script.parentNode.removeChild(script);
    });
  };

  doc.querySelector('#live').addEventListener('click', snapshot, false);
  doc.querySelector('#shutter').addEventListener('click', snapshot, false);
  timer.addEventListener('click', timed, false);
  doc.querySelector('#form-profile').addEventListener('submit', getUser, false);

  nav.getMedia = (nav.getUserMedia ||
                  nav.webkitGetUserMedia ||
                  nav.mozGetUserMedia ||
                  nav.msGetUserMedia);

  nav.getMedia({video: true}, function(stream) {
    video.src = (win.URL && win.URL.createObjectURL &&
      win.URL.createObjectURL(stream)) || stream;
    setTimeout(snapshot, 1000);
  }, function(err) {
    console.log(err);
  });

  handle.focus();
}(document, window, navigator));