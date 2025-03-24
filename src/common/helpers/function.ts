export const get_env = (key: string, defaultValue: string = null) => {
  return process.env[key] || defaultValue;
};
