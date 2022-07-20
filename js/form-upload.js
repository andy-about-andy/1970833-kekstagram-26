import {isEscapeKey} from './util.js';
import {chooseEffectDefault} from './image-editing.js';
import {sendData} from './api.js';

const body = document.querySelector('body');
const uploadFile = document.querySelector('#upload-file');
const buttonCancelUpload = document.querySelector('#upload-cancel');
const imgUpload = document.querySelector('.img-upload__overlay');
const uploadForm = document.querySelector('#upload-select-image');
const textHashtags = imgUpload.querySelector('.text__hashtags');
const textComment = imgUpload.querySelector('.text__description');
const MAX_HASHTAGS = 5;

const scaleControlImage = document.querySelector('.scale__control--value');
const previewImage = document.querySelector('.img-upload__preview');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',

});
const re = /^#[A-Za-zА-яа-яЁё0-9]{1,19}$/;

// значения констант для отправки данных
const successContainer = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
const successButton = successContainer.querySelector('.success__button');

const errorContainer = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
const errorButton = errorContainer.querySelector('.error__button');

const submitButton = document.querySelector('#upload-submit');


const onPopupEscKeydown = (evt) => {
  if (isEscapeKey(evt) && !body.contains(errorContainer)) {
    evt.preventDefault();
    closelImgUpload();
  }
};

// открытие формы редактирования изображения
const openUploadFile = () => {
  imgUpload.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onPopupEscKeydown);
  previewImage.style.transform = '';
  scaleControlImage.value = '100%';
  chooseEffectDefault();
};

uploadFile.addEventListener('change', openUploadFile);

// закрытие формы редактирования изображения
function closelImgUpload() {
  imgUpload.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onPopupEscKeydown);
  uploadFile.value = '';
  textHashtags.value = '';
  textComment.value = '';
}

buttonCancelUpload.addEventListener('click', () => {
  closelImgUpload();
});

// валидация формы добавления изображения (строка хэш-теги)
const validateTextHashtags = (text) => {
  if (text === '') {
    return true;
  }

  const hashtagsArr = text.toLowerCase().trim().split(' ');
  return hashtagsArr.every((hashtag) => re.test(hashtag));
};

pristine.addValidator(textHashtags, validateTextHashtags, 'Хэш-тэг начинается со знака "#". Содержит только буквы и цифры, не содержит пробелы. Количество символов: min=2, max=20, включая "#"');

const validateQuantityHashtags = (text) => {
  if (text === '') {
    return true;
  }

  const hashtagsArr = text.toLowerCase().trim().split(' ');
  if (hashtagsArr.length > MAX_HASHTAGS) {
    return false;
  }
  return true;
};

pristine.addValidator(textHashtags, validateQuantityHashtags, 'Не более 5 хэш-тэгов');

const validateRepeatHashtags = (text) => {
  if (text === '') {
    return true;
  }

  const hashtagsArr = text.toLowerCase().trim().split(' ');
  if (new Set(hashtagsArr).size !== hashtagsArr.length) {
    return false;
  }
  return true;
};

pristine.addValidator(textHashtags, validateRepeatHashtags, 'Хэш-тэги не должны повторяться');

// на время выполнения запроса к серверу кнопка «Отправить» блокируется
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

// закрытие окна об успешной отправке
const onPopupSuccessClose = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeSuccessPopup();
  }
};

const onSuccessContainerClick = (evt) => {
  if (evt.target === successContainer) {
    closeSuccessPopup();
  }
};

successButton.addEventListener('click', () => closeSuccessPopup());

function closeSuccessPopup () {
  successContainer.remove();
  document.removeEventListener('click', onSuccessContainerClick);
  document.removeEventListener('keydown', onPopupSuccessClose);
}

// открытие окна об успешной отправке
const showSuccessPopup = () => {
  body.append(successContainer);
  document.addEventListener('click', onSuccessContainerClick);
  document.addEventListener('keydown', onPopupSuccessClose);
};

const onSuccessFormSend = () => {
  closelImgUpload();
  showSuccessPopup();
  unblockSubmitButton();
};

// закрытие окна об ошибке
const onPopupErrorClose = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeErrorPopup();
  }
};

const onErrorContainerClick = (evt) => {
  if (evt.target === errorContainer) {
    closeErrorPopup();
  }
};

errorButton.addEventListener('click', () => closeErrorPopup());

function closeErrorPopup () {
  errorContainer.remove();
  document.removeEventListener('click', onErrorContainerClick);
  document.removeEventListener('keydown', onPopupErrorClose);
}

// открытие окна об ошибке
const showErrorPopup = () => {
  body.append(errorContainer);
  document.addEventListener('click', onErrorContainerClick);
  document.addEventListener('keydown', onPopupErrorClose);
};

const onErrorFormSend = () => {
  showErrorPopup();
  unblockSubmitButton();
};

// отменяет обработчик Esc при фокусе
const canсelsHandlerFocusInEscapeKey = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

textHashtags.addEventListener('keydown', canсelsHandlerFocusInEscapeKey);
textComment.addEventListener('keydown', canсelsHandlerFocusInEscapeKey);

// отправка формы
const setFormUpload = () => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(onSuccessFormSend, onErrorFormSend, new FormData(evt.target));
    }
  });
};

export {setFormUpload};
