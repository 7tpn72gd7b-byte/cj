const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const toast = $('.toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function setModal(modal, open) {
  modal.hidden = !open;
  document.body.classList.toggle('modal-open', open);
  if (open) modal.querySelector('.modal-close')?.focus();
}

const videoModal = $('#video-modal');
const contactModal = $('#contact-modal');
const simulatorModal = $('#simulator-modal');
$('[data-open-video]').addEventListener('click', () => setModal(videoModal, true));
$$('[data-close-modal]').forEach(el => el.addEventListener('click', () => setModal(videoModal, false)));
$('[data-open-simulator]').addEventListener('click', () => {
  setModal(simulatorModal, true);
  showSimulatorView('inicio');
});
$$('[data-close-simulator]').forEach(el => el.addEventListener('click', () => setModal(simulatorModal, false)));
$$('[data-contact]').forEach(el => el.addEventListener('click', () => {
  setModal(contactModal, true);
  setTimeout(() => $('#lead-form [name="name"]')?.focus(), 80);
}));
$$('[data-close-contact]').forEach(el => el.addEventListener('click', () => setModal(contactModal, false)));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!videoModal.hidden) setModal(videoModal, false);
    if (!simulatorModal.hidden) setModal(simulatorModal, false);
    if (!contactModal.hidden) setModal(contactModal, false);
  }
});

$$('.like-button').forEach(button => {
  button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') === 'true';
    const count = $('b', button);
    button.setAttribute('aria-pressed', String(!pressed));
    button.classList.toggle('liked', !pressed);
    $('span', button).textContent = pressed ? '♡' : '♥';
    count.textContent = String(Number(count.textContent) + (pressed ? -1 : 1));
    if (!pressed) showToast('Momento adicionado aos favoritos');
  });
});

$$('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    $$('[data-filter]').forEach(tab => {
      tab.classList.toggle('active', tab === button);
      tab.setAttribute('aria-selected', String(tab === button));
    });
    const filter = button.dataset.filter;
    $$('.feed-post').forEach(post => {
      const visible = filter === 'todos' ? post === $('.phone-stage .feed-post') : post.dataset.postType === filter;
      post.classList.toggle('hidden-post', !visible);
    });
    showToast(filter === 'todos' ? 'Mostrando todos os momentos' : `Filtro: ${button.textContent}`);
  });
});

$$('[data-comment]').forEach(button => button.addEventListener('click', () => showToast('Comentários fazem parte da comunidade VIMO')));
$$('[data-share]').forEach(button => button.addEventListener('click', async () => {
  const data = { title: 'VIMO', text: 'Conheça o VIMO — aquilo que você não viu, registrado por quem estava lá!', url: location.href };
  if (navigator.share) {
    try { await navigator.share(data); } catch (_) {}
  } else {
    await navigator.clipboard?.writeText(location.href);
    showToast('Link da demonstração copiado');
  }
}));

$('[data-create]').addEventListener('click', () => {
  setModal(simulatorModal, true);
  showSimulatorView('publicar');
});
$('[data-download-video]').addEventListener('click', () => showToast('Vídeos também podem ser baixados em alta qualidade'));

function showSimulatorView(viewName) {
  $$('[data-sim-view]', simulatorModal).forEach(view => {
    const active = view.dataset.simView === viewName;
    view.hidden = !active;
    view.classList.toggle('active', active);
  });
  $$('.simulator-nav [data-sim-nav]', simulatorModal).forEach(button => {
    button.classList.toggle('active', button.dataset.simNav === viewName);
  });
  $('.simulator-device', simulatorModal).scrollTop = 0;
}

$$('[data-sim-nav]', simulatorModal).forEach(button => {
  button.addEventListener('click', () => showSimulatorView(button.dataset.simNav));
});

$$('[data-sim-filter]', simulatorModal).forEach(button => {
  button.addEventListener('click', () => {
    $$('[data-sim-filter]', simulatorModal).forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    const filter = button.dataset.simFilter;
    $$('[data-sim-type]', simulatorModal).forEach(post => {
      post.hidden = filter !== 'todos' && post.dataset.simType !== filter;
    });
    showToast(filter === 'todos' ? 'Todos os momentos no feed' : `${button.textContent} no feed`);
  });
});

function bindSimulatorLike(button) {
  button.addEventListener('click', () => {
    const pressed = button.getAttribute('aria-pressed') === 'true';
    const count = $('b', button);
    button.setAttribute('aria-pressed', String(!pressed));
    button.classList.toggle('liked', !pressed);
    $('span', button).textContent = pressed ? '♡' : '♥';
    count.textContent = String(Number(count.textContent) + (pressed ? -1 : 1));
    showToast(pressed ? 'Curtida removida' : 'Momento adicionado aos favoritos');
  });
}

$$('[data-sim-like]', simulatorModal).forEach(bindSimulatorLike);

$('[data-sim-focus-comment]', simulatorModal).addEventListener('click', () => {
  $('[data-sim-comment-form] input', simulatorModal).focus();
});

$('[data-sim-comment-form]', simulatorModal).addEventListener('submit', event => {
  event.preventDefault();
  const input = $('input', event.currentTarget);
  const message = input.value.trim();
  if (!message) {
    input.focus();
    showToast('Escreva um comentário para testar');
    return;
  }
  const comment = document.createElement('p');
  const author = document.createElement('strong');
  author.textContent = 'Você';
  comment.append(author, ` ${message}`);
  $('[data-sim-comments]', simulatorModal).append(comment);
  const count = $('[data-sim-comment-count]', simulatorModal);
  count.textContent = String(Number(count.textContent) + 1);
  input.value = '';
  showToast('Comentário adicionado à demonstração');
});

$$('[data-sim-share]', simulatorModal).forEach(button => {
  button.addEventListener('click', async () => {
    const data = { title: 'VIMO', text: 'Conheça a experiência VIMO para eventos.', url: location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch (_) {}
    } else {
      await navigator.clipboard?.writeText(location.href);
      showToast('Link do VIMO copiado');
    }
  });
});

$('[data-sim-video]', simulatorModal).addEventListener('click', event => {
  const player = event.currentTarget;
  const playing = player.classList.toggle('playing');
  $('.simulator-play', player).textContent = playing ? '❚❚' : '▶';
  showToast(playing ? 'Prévia visual de vídeo ativada' : 'Prévia visual pausada');
});

$('[data-sim-video-comment]', simulatorModal).addEventListener('click', () => showToast('Os convidados podem conversar em cada publicação'));
$('[data-sim-download-video]', simulatorModal).addEventListener('click', () => showToast('Na plataforma, o vídeo original é baixado em alta qualidade'));
$$('[data-gallery-item]', simulatorModal).forEach(item => item.addEventListener('click', () => showToast('Momento aberto em tela cheia')));

$$('[data-simulator-contact]', simulatorModal).forEach(button => {
  button.addEventListener('click', () => {
    setModal(simulatorModal, false);
    setModal(contactModal, true);
    setTimeout(() => $('#lead-form [name="name"]')?.focus(), 80);
  });
});

const simulatorMedia = $('#sim-media');
const simulatorPreview = $('[data-sim-preview]', simulatorModal);
const simulatorPublishForm = $('[data-sim-publish-form]', simulatorModal);
const simulatorObjectUrls = [];
let currentPreviewUrl = '';

function renderSimulatorMedia(container, file, url) {
  container.replaceChildren();
  const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
  media.src = url;
  if (media.tagName === 'VIDEO') {
    media.controls = true;
    media.playsInline = true;
  }
  media.alt = media.tagName === 'IMG' ? 'Prévia da foto selecionada' : '';
  container.append(media);
}

simulatorMedia.addEventListener('change', () => {
  const file = simulatorMedia.files?.[0];
  if (!file) {
    simulatorPreview.hidden = true;
    return;
  }
  if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl);
  currentPreviewUrl = URL.createObjectURL(file);
  renderSimulatorMedia(simulatorPreview, file, currentPreviewUrl);
  simulatorPreview.hidden = false;
  showToast('Mídia pronta para a demonstração');
});

simulatorPublishForm.addEventListener('submit', event => {
  event.preventDefault();
  const file = simulatorMedia.files?.[0];
  if (!file || !currentPreviewUrl) {
    simulatorMedia.focus();
    showToast('Escolha uma foto ou vídeo para continuar');
    return;
  }

  const captionText = String(new FormData(simulatorPublishForm).get('caption') || '').trim() || 'Meu olhar deste momento ✨';
  const post = document.createElement('article');
  post.className = 'simulator-post simulator-user-post';
  post.dataset.simType = file.type.startsWith('video/') ? 'videos' : 'fotos';

  const header = document.createElement('div');
  header.className = 'post-author';
  header.innerHTML = '<span class="avatar avatar-v">V</span><div><strong>Você</strong><small>Agora mesmo · Demonstração</small></div><button type="button" aria-label="Mais opções">•••</button>';

  const mediaBox = document.createElement('div');
  mediaBox.className = 'simulator-media simulator-user-media';
  renderSimulatorMedia(mediaBox, file, currentPreviewUrl);
  const badge = document.createElement('span');
  badge.className = 'quality-badge';
  badge.textContent = 'NOVO';
  mediaBox.append(badge);

  const actions = document.createElement('div');
  actions.className = 'simulator-actions';
  actions.innerHTML = '<button type="button" data-sim-like aria-label="Curtir publicação" aria-pressed="false"><span>♡</span><b>0</b></button><button type="button" aria-label="Comentar"><span>◯</span><b>0</b></button><button type="button" data-sim-share aria-label="Compartilhar"><span>↗</span></button>';

  const caption = document.createElement('p');
  caption.className = 'simulator-caption';
  const author = document.createElement('strong');
  author.textContent = 'Você';
  caption.append(author, ` ${captionText}`);
  post.append(header, mediaBox, actions, caption);
  $('[data-sim-feed]', simulatorModal).prepend(post);

  bindSimulatorLike($('[data-sim-like]', post));
  $('[data-sim-share]', post).addEventListener('click', async () => {
    await navigator.clipboard?.writeText(location.href);
    showToast('Link do VIMO copiado');
  });

  simulatorObjectUrls.push(currentPreviewUrl);
  currentPreviewUrl = '';
  simulatorPublishForm.reset();
  simulatorPreview.hidden = true;
  simulatorPreview.replaceChildren();
  $('[data-sim-post-total]', simulatorModal).textContent = String($$('.simulator-user-post', simulatorModal).length + 1);
  $('[data-sim-filter="todos"]', simulatorModal).click();
  showSimulatorView('inicio');
  showToast('Sua publicação apareceu no feed!');
});

window.addEventListener('beforeunload', () => simulatorObjectUrls.forEach(url => URL.revokeObjectURL(url)));

const leadForm = $('#lead-form');

function setFieldError(name, message = '') {
  const field = leadForm.elements[name];
  const error = $(`[data-error-for="${name}"]`, leadForm);
  field?.classList.toggle('invalid', Boolean(message));
  if (error) error.textContent = message;
}

['name', 'eventType', 'city'].forEach(name => {
  leadForm.elements[name].addEventListener('input', () => setFieldError(name));
  leadForm.elements[name].addEventListener('change', () => setFieldError(name));
});

leadForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(leadForm);
  const name = String(data.get('name') || '').trim();
  const eventType = String(data.get('eventType') || '').trim();
  const city = String(data.get('city') || '').trim();
  const eventDate = String(data.get('eventDate') || '').trim();
  const guests = String(data.get('guests') || '').trim();

  setFieldError('name', name.length < 2 ? 'Informe seu nome para continuar.' : '');
  setFieldError('eventType', !eventType ? 'Selecione o tipo do evento.' : '');
  setFieldError('city', city.length < 2 ? 'Informe a cidade e o estado.' : '');

  const firstInvalid = $('.invalid', leadForm);
  if (firstInvalid) {
    firstInvalid.focus();
    showToast('Confira os campos destacados.');
    return;
  }

  const formattedDate = eventDate
    ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${eventDate}T12:00:00Z`))
    : 'Ainda não definida';
  const message = [
    'Olá, Júlio! Conheci o VIMO e tenho interesse em contratar uma versão personalizada para o meu evento.',
    '',
    `Nome: ${name}`,
    `Tipo de evento: ${eventType}`,
    `Cidade/Estado: ${city}`,
    `Data do evento: ${formattedDate}`,
    `Número estimado de convidados: ${guests || 'Ainda não definido'}`,
    '',
    'Gostaria de receber mais informações sobre funcionamento, personalização e valores.'
  ].join('\n');
  const contactPhone = String(window.VIMO_CONFIG?.whatsapp || '').replace(/\D/g, '');
  if (contactPhone.length < 10 || contactPhone.length > 15) {
    showToast('Atendimento ainda não configurado. Consulte o responsável pelo site.');
    return;
  }
  window.location.href = `https://wa.me/${contactPhone}?text=${encodeURIComponent(message)}`;
});


// Example themes describe the presentation only; no customer data is used.
const themes = {
 casamento: ['Clara & Miguel', 'O nosso grande dia, pelo olhar de quem amamos.'],
 formatura: ['Turma 2026', 'Uma conquista. Uma turma. Histórias para a vida.'],
 corporativo: ['Conexões que inspiram', 'Pessoas, ideias e encontros que merecem ficar.']
};
$$('[data-theme]').forEach(button => button.addEventListener('click', () => {
 const theme = button.dataset.theme;
 $('[data-theme-preview]').dataset.themePreview = theme;
 $('[data-theme-title]').textContent = themes[theme][0];
 $('[data-theme-description]').textContent = themes[theme][1];
 $$('[data-theme]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));
// Keep keyboard focus in the active dialog, returning it to its trigger on close.
let modalTrigger;
const originalSetModal = setModal;
setModal = function(modal, open) {
 if (open) modalTrigger = document.activeElement;
 originalSetModal(modal, open);
 if (!open) modalTrigger?.focus();
};
document.addEventListener('keydown', event => {
 if (event.key !== 'Tab') return;
 const modal = $$('.modal').find(item => !item.hidden);
 if (!modal) return;
 const elements = $$('button, a[href], input, select, textarea, summary', modal).filter(item => item.getClientRects().length && !item.disabled);
 const first = elements[0], last = elements.at(-1);
 if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
 else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});

$$('.phone-stage .stories button, .phone-stage .app-nav button, .phone-stage .app-head button, .phone-stage .post-author button').forEach(button => button.addEventListener('click', () => { setModal(simulatorModal, true); showSimulatorView('inicio'); }));
