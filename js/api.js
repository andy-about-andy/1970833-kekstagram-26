const URL_GET = 'https://26.javascript.htmlacademy.pro/kekstagram/data';
const URL_SEND = 'https://26.javascript.htmlacademy.pro/kekstagram';

const getData = async (onSuccess, onFail) => {
  try {
    const response = await fetch(URL_GET);

    if (!response.ok) {
      throw new Error('Не удалось загрузить фотографии');
    }

    const offers = await response.json();
    onSuccess(offers);

    // после завершения загрузки изображений с сервера появятся кнопки переключения фильтров
    const filterConteiner = document.querySelector('.img-filters');
    filterConteiner.classList.remove('img-filters--inactive');

  } catch (error) {
    onFail(error.message);
  }
};

const sendData = async (onSuccess, onFail, body) => {
  try {
    const response = await fetch(URL_SEND,
      {
        method: 'POST',
        body,
      }
    );

    if (!response.ok) {
      throw new Error('Не удалось отправить фотографию. Попробуйте ещё раз');
    }

    onSuccess();
  } catch (error) {
    onFail(error.message);
  }
};

export {getData, sendData};
