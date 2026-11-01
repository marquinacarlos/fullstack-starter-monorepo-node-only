import { z } from 'zod';
import { NotFoundError, ValidationError } from '../../core/errors.js';

const name = z.string().trim().min(1, 'Name is required').max(100, 'Name is too long (max 100)');
const description = z.string().nullable();

export const createItemSchema = z.object({ name, description: description.optional() });

export const updateItemSchema = z
  .object({ name: name.optional(), description: description.optional() })
  .refine((value) => Object.keys(value).length > 0, 'Send at least one field');

/** Parses data or throws a 422 with the list of problems. */
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    );
  }
  return result.data;
}

export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new NotFoundError('Item not found');
  return id;
}
