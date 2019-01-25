export const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const parseJSON = (info) => {
  const infoObject = {};

  Object.keys(info).forEach((key) => {
    try {
      infoObject[key] = JSON.parse(info[key]);
    } catch (e) {
      infoObject[key] = info[key];
    }
  });

  return info;
};

export const parseJSONSingle = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const stringifyJSON = (info) => {
  const infoObject = {};
  Object.keys(info).forEach((key) => {
    infoObject[key] = JSON.stringify(info[key]);
  });
};
