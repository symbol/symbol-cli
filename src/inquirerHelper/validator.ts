/*
 *
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
interface Param {
  value: string;
  errors?: string[];
}
type Validator = (param: Param) => Param;
type Adapted = (value: string) => boolean | string;

export const create = (condition: (value: string) => boolean, errorMessage: string): Validator => {
  return ({value, errors = []}: Param): Param => {
    return condition(value) ?
      {value, errors} :
      {value, errors: [...errors, errorMessage]}
    ;
  };
};

export const compose = (...fns: Validator[]): Validator => {
  return (value: Param): Param => {
    return fns.reduce((param: Param, fn: Validator) => fn(param), value);
  };
};

export const adapter = (composed: Validator): Adapted => {
  return (value: string): boolean | string => {
    const result = composed({value});
    return result.errors && result.errors.length > 0 ? result.errors.join('\n') : true;
  };
};

export const url = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => /^https?:\/\/[^/]/.test(value), errorMessage || 'Input valid URL.'),
    ))(input);
  };
};

export const namespace = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => value.length < 64, errorMessage || 'Name must be maximum length of 64 characters.'),
      create((value: string) => /^[a-z0-9‘_\-.]+$/.test(value), errorMessage || 'Allowed characters are a, b, c, …, z, 0, 1, 2, …, 9, ‘, _ , -.'),
    ))(input);
  };
};

export const mosaic = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => value.length < 64, errorMessage || 'Name must be maximum length of 64 characters.'),
      create((value: string) => /^[a-z0-9‘_\-.]+$/.test(value), errorMessage || 'Allowed characters are a, b, c, …, z, 0, 1, 2, …, 9, ‘, _ , -.'),
    ))(input);
  };
};

export const mosaicFqn = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(
      create((value: string) => /^[a-z0-9‘_\-.]+:[a-z0-9‘_\-.]+$/.test(value), errorMessage || 'Input mosaic FQN. (example: nem:xem)'),
    )(input);
  };
};

export const address = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => /^[SMNT][0-9A-Z\-]{39,45}$/.test(value), errorMessage || 'Input valid address format.'),
    ))(input);
  };
};

export const transferSchema = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => /^[a-z0-9‘_\-.]+:[a-z0-9‘_\-.]+::\d+$/.test(value), errorMessage || 'Input valid format.'),
    ))(input);
  };
};

export const message = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => Buffer.byteLength(value, 'urf8') < 1024, errorMessage || 'Message must be less than 1024 characters.'),
    ))(input);
  };
};

export const key = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => value.length === 64, errorMessage || 'Key must be length of 64 characters.'),
      create((value: string) => /^[0-9a-zA-Z]+$/.test(value), errorMessage || 'Input valid format.'),
    ))(input);
  };
};

export const transactionHash = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(compose(
      create((value: string) => value.length === 64, errorMessage || 'Transaction hash must be length of 64 characters.'),
      create((value: string) => /^[0-9A-Fa-f]+$/.test(value), errorMessage || 'Transaction hash must be HEX format.'),
    ))(input);
  };
};

export const uint64 = (errorMessage?: string) => {
  return (input: string): boolean | string => {
    return adapter(
      create((value: string) => /^\[\s*\d+\s*,\s*\d+\s*\]+$/.test(value), errorMessage || 'Input uint64 format. (example: [number, number])'),
    )(input);
  };
};
