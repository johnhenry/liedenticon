//@flow
export default (input: string | number) => {
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 255;
  if (typeof input === "string") {
    if (input[0] === "#") {
      input = input.substr(1);
    }
  } else if (typeof input === "number") {
    input = input.toString(16);
  }
  if (!input.length) {
    return [red, green, blue, alpha];
  }

  if (input.length === 5 || input.length === 7 || input.length > 8) {
    throw new Error(`color of length ${input.length} not supported`);
  }

  if (input.length < 3) {
    //1,2
    red = green = blue = parseInt(input[0].repeat(2), 16);
    if (input.length > 1) {
      alpha = parseInt(input[1].repeat(2), 16);
    }
  } else if (input.length < 5) {
    console.log(input);
    //3, 4
    red = parseInt(input.substr(0, 1).repeat(2), 16);
    green = parseInt(input.substr(1, 1).repeat(2), 16);
    blue = parseInt(input.substr(2, 1).repeat(2), 16);
    if (input.length > 3) {
      alpha = parseInt(input.substr(3, 1).repeat(2), 16);
    }
  } else if (input.length < 9) {
    //6, 8
    red = parseInt(input.substr(0, 2), 16);
    green = parseInt(input.substr(2, 2), 16);
    blue = parseInt(input.substr(4, 2), 16);
    if (input.length > 6) {
      alpha = parseInt(input.substr(6, 2), 16);
    }
  } else {
    throw new Error(`color of length ${input.length} not supported`);
  }
  return [red, green, blue, alpha];
};
