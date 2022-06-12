// Случайное целое число от min до max включительно
const getRandomInteger = (min, max) => {
  if (min < max && min >= 0 && max > 0) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }
};

// проверка максимальной длины строки
const maxLengthComment = 140;

const stringLength = (string) => {
  if (typeof string === 'string') {
    return string.length <= maxLengthComment;
  }
};

stringLength('');

const DESCRIPTION = [
  'описание фото раз',
  'описание фото два',
  'описание фото три',
  'описание фото четыре',
  'описание фото пять',
  'описание фото шесть',
  'описание фото семь',
  'описание фото восемь',
  'описание фото девять',
  'описание фото десять',
];

const MESSAGE = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const NAME = [
  'Петя',
  'Маша',
  'Катя',
  'Сергей',
  'Митя',
  'София',
];

const NUMBER_GENERATION_OBJECTS = 25;
const idArray = Array.from({length:25}, (_, k)=> ++k);
const idCommentsArray = Array.from({length:25}, (_, k)=> ++k);

const createPost = () => {
  const id = idArray.shift();
  const idComment = idCommentsArray.shift();
  return {
    id: id,
    url: `img/photos/${id}.jpg`,
    description: DESCRIPTION[getRandomInteger(0, DESCRIPTION.length - 1)],
    likes: getRandomInteger(0, 250),
    comments: [
      {id: idComment, avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`, message: MESSAGE[getRandomInteger(0, MESSAGE.length - 1)], name: NAME[getRandomInteger(0, NAME.length - 1)]},
      {id: idComment + 1, avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`, message: MESSAGE[getRandomInteger(0, MESSAGE.length - 1)], name: NAME[getRandomInteger(0, NAME.length - 1)]},
      {id: idComment + 2, avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`, message: MESSAGE[getRandomInteger(0, MESSAGE.length - 1)], name: NAME[getRandomInteger(0, NAME.length - 1)]},
    ],
  };
};

const generatioObjects = Array.from({length: NUMBER_GENERATION_OBJECTS}, createPost);
console.log(generatioObjects);
