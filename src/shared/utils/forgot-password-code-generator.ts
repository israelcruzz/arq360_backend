export const generateCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const code = [];

  for (let i = 1; 1 <= 3; i++) {
    const randomNumber = Math.floor(Math.random() * 10);

    code.push(randomNumber);
  }

  for (let i = 1; 1 <= 3; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);

    code.push(letters[randomIndex]);
  }

  return code.join('');
};
