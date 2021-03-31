export const getBaseName = pathname => {
  let release = '/';
  const pathName = pathname.split('/');

  pathName.shift();

  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }

  if (pathName[1]) {
    return `${release}${pathName[0]}/${pathName[1]}`;
  }
  return `${release}${pathName[0]}`;
};
