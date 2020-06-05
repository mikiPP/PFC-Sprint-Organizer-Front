export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const cleanObject = function (obj) {
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
};
